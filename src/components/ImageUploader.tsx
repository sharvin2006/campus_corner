import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Plus, ShieldCheck, Loader2 } from 'lucide-react';
import { checkProhibitedImage, ProhibitedCheckResult } from '../data/prohibitedItems';

interface SingleImageUploadProps {
  mode?: 'single';
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspect?: 'square' | 'video' | 'banner';
  placeholder?: string;
  samplePresets?: { name: string; url: string }[];
  onProhibitedBlocked?: (result: ProhibitedCheckResult) => void;
}

interface MultiImageUploadProps {
  mode: 'multiple';
  values: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  label?: string;
  samplePresets?: { name: string; url: string }[];
  onProhibitedBlocked?: (result: ProhibitedCheckResult) => void;
  scanProhibitedContent?: boolean;
  onScanStatusChange?: (scanning: boolean) => void;
  onScanComplete?: (summary: { acceptedCount: number; blockedCount: number }) => void;
}

type ImageUploaderProps = SingleImageUploadProps | MultiImageUploadProps;

// Utility to optimize image files to lightweight compressed base64
export const compressImageFile = (file: File, maxWidth = 1000, maxHeight = 1000, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((height * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const ImageUploader: React.FC<ImageUploaderProps> = (props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [isScanningImages, setIsScanningImages] = useState(false);

  const scanImageViaApi = async (payload: { imageDataUrl?: string; imageUrl?: string }): Promise<ProhibitedCheckResult> => {
    try {
      const response = await fetch('/api/prohibited-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) return { isBlocked: false };
      const data = await response.json();
      if (data?.isBlocked) {
        return {
          isBlocked: true,
          detectedWord: data.detectedWord || 'Prohibited Product',
          category: data.category || 'Prohibited Campus Item',
          reason:
            data.reason ||
            'This product is not allowed in the PSAS Campus Corner Marketplace.',
          source: 'image',
        };
      }
      return { isBlocked: false };
    } catch {
      return { isBlocked: false };
    }
  };

  // Handle Multi Mode (up to 10 images)
  if (props.mode === 'multiple') {
    const {
      values,
      onChange,
      max = 10,
      label = 'Upload Photos',
      samplePresets,
      onProhibitedBlocked,
      scanProhibitedContent = false,
      onScanStatusChange,
      onScanComplete,
    } = props;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      setIsProcessing(true);
      if (scanProhibitedContent) {
        setIsScanningImages(true);
        onScanStatusChange?.(true);
      }
      const remainingSlots = max - values.length;
      const filesToProcess = files.slice(0, remainingSlots);

      try {
        const acceptedImages: string[] = [];
        let blockedCount = 0;

        for (const file of filesToProcess) {
          // 1. Instant file name screening
          const nameCheck = checkProhibitedImage(file.name);
          if (nameCheck.isBlocked) {
            blockedCount += 1;
            if (onProhibitedBlocked) {
              onProhibitedBlocked(nameCheck);
            }
            continue;
          }

          // 2. Compress image
          const compressed = await compressImageFile(file);

          // 3. Visual AI Prohibited Image Scan
          if (scanProhibitedContent) {
            const visualCheck = await scanImageViaApi({ imageDataUrl: compressed });
            if (visualCheck.isBlocked) {
              blockedCount += 1;
              if (onProhibitedBlocked) {
                onProhibitedBlocked(visualCheck);
              }
              continue;
            }
          }

          acceptedImages.push(compressed);
        }

        if (acceptedImages.length > 0) {
          onChange([...values, ...acceptedImages]);
        }
        if (scanProhibitedContent) {
          onScanComplete?.({ acceptedCount: acceptedImages.length, blockedCount });
        }
      } catch (err) {
        console.error('Failed to process image files', err);
      } finally {
        setIsProcessing(false);
        setIsScanningImages(false);
        onScanStatusChange?.(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    const handleRemove = (index: number) => {
      const next = values.filter((_, i) => i !== index);
      onChange(next);
    };

    const handleAddUrl = async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = urlDraft.trim();
      if (!trimmed) return;

      // 1. Instant URL keyword check
      const urlCheck = checkProhibitedImage(trimmed);
      if (urlCheck.isBlocked) {
        if (onProhibitedBlocked) {
          onProhibitedBlocked(urlCheck);
        }
        if (scanProhibitedContent) {
          onScanComplete?.({ acceptedCount: 0, blockedCount: 1 });
        }
        return;
      }

      // 2. Visual AI scan on pasted image URL
      if (scanProhibitedContent) {
        setIsScanningImages(true);
        onScanStatusChange?.(true);
        const visualCheck = await scanImageViaApi({ imageUrl: trimmed });
        setIsScanningImages(false);
        onScanStatusChange?.(false);
        if (visualCheck.isBlocked) {
          if (onProhibitedBlocked) {
            onProhibitedBlocked(visualCheck);
          }
          onScanComplete?.({ acceptedCount: 0, blockedCount: 1 });
          return;
        }
      }

      if (values.length < max) {
        onChange([...values, trimmed]);
        setUrlDraft('');
        setShowUrlInput(false);
        if (scanProhibitedContent) {
          onScanComplete?.({ acceptedCount: 1, blockedCount: 0 });
        }
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs gap-2">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            {label}
          </span>
          <div className="flex items-center gap-2">
            {scanProhibitedContent && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 inline-flex items-center gap-1">
                {isScanningImages ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Scanning image...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>AI Image Scan Active</span>
                  </>
                )}
              </span>
            )}
            <span className="text-[11px] font-mono text-cyan-400">
              {values.length} / {max} photos
            </span>
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
          {values.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-700/80 group shadow-sm"
            >
              <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
              {idx === 0 && (
                <span className="absolute bottom-1 left-1 bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 text-[9px] font-bold px-1.5 py-0.2 rounded">
                  Primary Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 p-1 rounded-full bg-slate-950/80 text-rose-400 hover:text-white hover:bg-rose-600 transition-colors"
                title="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Add Tile */}
          {values.length < max && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-slate-700 hover:border-cyan-500/60 bg-slate-950/50 hover:bg-slate-900 flex flex-col items-center justify-center p-2 text-slate-400 hover:text-cyan-300 transition-all cursor-pointer group"
            >
              <Plus className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform text-cyan-400" />
              <span className="text-[10px] font-medium leading-tight text-center">
                {isProcessing ? 'Processing...' : 'Upload Photo'}
              </span>
              <span className="text-[9px] text-slate-500 mt-0.5">Device / Camera</span>
            </button>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Action Row: Toggle URL input & Presets */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'Hide URL input' : 'Paste Image URL instead'}</span>
          </button>

          {samplePresets && samplePresets.length > 0 && values.length < max && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-500 text-[10px]">Sample presets:</span>
              {samplePresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => onChange([...values, preset.url])}
                  className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 hover:text-cyan-300 border border-slate-800 text-[10px] transition-colors"
                >
                  +{preset.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Optional URL input box */}
        {showUrlInput && (
          <div className="flex gap-2 pt-1">
            <input
              type="url"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void handleAddUrl(e);
                }
              }}
              placeholder="https://example.com/item-photo.jpg"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
            />
            <button
              type="button"
              onClick={(e) => void handleAddUrl(e)}
              disabled={isScanningImages}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 text-xs font-semibold text-white"
            >
              {isScanningImages ? 'Scanning...' : 'Add URL'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Handle Single Mode
  const { value, onChange, label = 'Upload Photo', aspect = 'video', samplePresets, onProhibitedBlocked } = props;

  const handleSingleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file name for prohibited items
    const nameCheck = checkProhibitedImage(file.name);
    if (nameCheck.isBlocked) {
      if (onProhibitedBlocked) {
        onProhibitedBlocked(nameCheck);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsProcessing(true);
    try {
      const compressed = await compressImageFile(file);
      onChange(compressed);
    } catch (err) {
      console.error('Failed to compress image file', err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const aspectClass =
    aspect === 'square'
      ? 'aspect-square w-24 sm:w-28'
      : aspect === 'banner'
      ? 'aspect-[3/1] w-full'
      : 'aspect-video w-full';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <label className="font-semibold text-slate-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 text-[11px] transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Use file uploader' : 'Paste URL'}</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-3">
        {/* Preview Frame */}
        <div
          className={`relative ${aspectClass} rounded-xl overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 shadow-inner group`}
        >
          {value ? (
            <>
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-medium transition-opacity cursor-pointer"
              >
                <Upload className="w-5 h-5 mb-1" />
                <span>Replace</span>
              </button>
            </>
          ) : (
            <div className="text-center p-3 text-slate-500">
              <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
              <span className="text-[10px]">No image</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isProcessing ? 'Optimizing...' : 'Choose from Device'}</span>
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 text-xs transition-colors"
                title="Clear image"
              >
                Clear
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleSingleFileChange}
            className="hidden"
          />

          {showUrlInput ? (
            <div className="flex gap-2">
              <input
                type="url"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          ) : null}

          {samplePresets && samplePresets.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] text-slate-500">Presets:</span>
              {samplePresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => onChange(preset.url)}
                  className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-cyan-400 transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
