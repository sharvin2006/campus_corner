export interface PrivacyScanResult {
  hasSensitiveData: boolean;
  findings: string[];
  sanitizedText: string;
  redactedCount: number;
}

export const SAFE_CAMPUS_MEETUP_SPOTS = [
  'Perpustakaan PSAS Lobby',
  'Kafeteria Kolej Kediaman',
  'Dataran Gemilang PSAS',
  'Pondok Pengawal Utama PSAS',
] as const;

const PHONE_REGEX = /(?:\+?60|0)1[0-9](?:[\s\-]?\d){7,9}\b/g;
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const MYKAD_REGEX = /\b\d{6}-\d{2}-\d{4}\b/g;
const MATRIX_REGEX = /\b0\d[A-Z]{2,4}\d{2}[A-Z]\d{3,5}\b/gi;
const EXTERNAL_HANDLE_REGEX =
  /(?:https?:\/\/)?(?:wa\.me|api\.whatsapp\.com|t\.me|telegram\.me)\/[^\s]+|@(?:whatsapp|telegram)\b/gi;
const BANK_OR_LONG_DIGITS_REGEX = /\b\d{10,16}\b/g;

export function scanMessagePrivacy(text: string): PrivacyScanResult {
  if (!text) {
    return {
      hasSensitiveData: false,
      findings: [],
      sanitizedText: '',
      redactedCount: 0,
    };
  }

  const findings: string[] = [];
  let sanitized = text;
  let redactedCount = 0;

  const replaceWithLabel = (regex: RegExp, label: string, token: string) => {
    const matches = sanitized.match(regex);
    if (matches && matches.length > 0) {
      findings.push(label);
      redactedCount += matches.length;
      sanitized = sanitized.replace(regex, token);
    }
  };

  replaceWithLabel(MYKAD_REGEX, 'MyKad / IC Number', '[IC REDACTED]');
  replaceWithLabel(EMAIL_REGEX, 'Email Address', '[EMAIL REDACTED]');
  replaceWithLabel(EXTERNAL_HANDLE_REGEX, 'External Chat Link', '[EXTERNAL LINK REDACTED]');
  replaceWithLabel(MATRIX_REGEX, 'Full Matrix Number', '[MATRIX REDACTED]');
  replaceWithLabel(PHONE_REGEX, 'Phone Number', '[PHONE REDACTED]');
  replaceWithLabel(BANK_OR_LONG_DIGITS_REGEX, 'Account / Long Number', '[NUMBER REDACTED]');

  return {
    hasSensitiveData: findings.length > 0,
    findings,
    sanitizedText: sanitized,
    redactedCount,
  };
}

export function maskMatrixNumber(matrix?: string): string {
  if (!matrix || matrix.length < 5) return 'PSAS-VERIFIED';
  const clean = matrix.trim().toUpperCase();
  const prefix = clean.slice(0, Math.min(5, clean.length - 2));
  const suffix = clean.slice(-2);
  return `${prefix}•••${suffix}`;
}

export function getMaskedStudentHandle(
  name: string,
  matrix?: string,
  roleLabel?: 'Buyer' | 'Seller' | 'Student'
): string {
  const role = roleLabel || 'Student';
  if (matrix && matrix.trim().length >= 4) {
    const tail = matrix.trim().slice(-4).toUpperCase();
    return `PSAS ${role} #${tail}`;
  }
  const firstInitial = name?.trim()?.charAt(0)?.toUpperCase() || 'P';
  return `PSAS ${role} (${firstInitial}••)`;
}

export function getFirstNameOnly(name: string): string {
  const cleaned = name.replace(/\(You\)/gi, '').trim();
  const first = cleaned.split(/\s+/)[0] || 'Student';
  return first;
}

export function computeP2PSessionCode(itemId: string, peerId: string, userId: string): string {
  const seed = [itemId, peerId, userId].sort().join(':');
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const hex = (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
  return `P2P-${hex.slice(0, 4)}-${hex.slice(4, 6)}`;
}
