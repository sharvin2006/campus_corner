import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface StudyResourceSummary {
  id: string;
  title: string;
  department: string;
  courseCode: string;
  resourceType: string;
  price: number;
  rating: number;
  authorOrTutor: string;
  authorSemester: string;
  description: string;
  status: string;
  tutoringMode?: string;
  availabilitySchedule?: string;
  keyTopics?: string[];
  downloadsCount?: number;
}

interface ChatHistoryTurn {
  role: 'user' | 'assistant';
  text: string;
}

interface StudyAiRequestBody {
  message?: string;
  course?: string;
  department?: string;
  language?: 'en' | 'bm';
  history?: ChatHistoryTurn[];
  resources?: StudyResourceSummary[];
}

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: 35000,
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function extractReadableAiError(err: unknown, fallback: string): string {
  const errorObj = err as { status?: number; statusCode?: number; message?: string };
  const rawMsg = typeof errorObj?.message === 'string' ? errorObj.message.trim() : '';
  if (!rawMsg) return fallback;

  if (rawMsg.startsWith('{')) {
    try {
      const parsed = JSON.parse(rawMsg);
      const innerMsg = parsed?.error?.message || parsed?.message;
      const innerStatus = parsed?.error?.status;
      if (innerStatus === 'DEADLINE_EXCEEDED' || parsed?.error?.code === 504) {
        return 'The AI service took too long to respond. Please click retry in a moment.';
      }
      if (typeof innerMsg === 'string' && innerMsg.trim()) {
        return innerMsg.trim();
      }
    } catch {
      // ignore JSON parse failure
    }
  }
  return rawMsg;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '2mb' }));

  app.post('/api/study-ai', async (req: Request, res: Response) => {
    try {
      const body = (req.body || {}) as StudyAiRequestBody;
      const message = typeof body.message === 'string' ? body.message.trim() : '';

      if (!message) {
        res.status(400).json({ error: 'Please enter a question or course topic to ask the AI.' });
        return;
      }

      const ai = getAiClient();
      if (!ai) {
        res.status(500).json({
          error: 'Gemini API key is not configured on the server. Please set GEMINI_API_KEY in Secrets.',
        });
        return;
      }

      const selectedCourse = typeof body.course === 'string' && body.course.trim()
        ? body.course.trim()
        : 'All Courses';
      const selectedDept = typeof body.department === 'string' && body.department.trim()
        ? body.department.trim()
        : 'All';
      const language = body.language === 'bm' ? 'bm' : 'en';
      const resources = Array.isArray(body.resources) ? body.resources : [];
      const history = Array.isArray(body.history) ? body.history.slice(-8) : [];

      const catalogJson = JSON.stringify(
        resources.map((r) => ({
          id: r.id,
          title: r.title,
          department: r.department,
          courseCode: r.courseCode,
          resourceType: r.resourceType,
          price: r.price,
          rating: r.rating,
          authorOrTutor: r.authorOrTutor,
          authorSemester: r.authorSemester,
          status: r.status,
          tutoringMode: r.tutoringMode || null,
          availabilitySchedule: r.availabilitySchedule || null,
          keyTopics: r.keyTopics || [],
          description: r.description,
        })),
        null,
        2
      );

      const languageInstruction =
        language === 'bm'
          ? 'Respond primarily in Bahasa Melayu (friendly Politeknik Malaysia student tone, keeping official course codes and titles clear), unless the student writes specifically in English.'
          : 'Respond in clear, friendly English (matching Bahasa Melayu if the student asks in Bahasa Melayu).';

      const systemInstruction = `You are the Campus Corner PSAS Study AI Assistant for students at Politeknik Sultan Azlan Shah (PSAS), Behrang, Perak.
Your job is to help students find the best peer tutors, skill exchanges, past year papers, and lecture notes based on their selected course and question.

Student Context:
- Selected Course / Subject: ${selectedCourse}
- Selected PSAS Department: ${selectedDept}

${languageInstruction}

Available PSAS Study Catalog (live listings on Campus Corner):
${catalogJson}

Guidelines:
1. Prioritize recommending real matching listings from the Available PSAS Study Catalog above (peer tutors, skill exchanges, past year papers, or lecture notes) that match the selected course code, course topic, or department.
2. When recommending listings, include their exact "id" values in "recommendedResourceIds" (up to 4 most relevant IDs). Never invent or modify an ID.
3. In "reply", clearly highlight why each recommended tutor or material fits (mentioning course code, tutor/author name, price or FREE, rating, and tutoring mode/schedule if relevant). Keep the reply concise, structured, and easy to scan (under ~180 words unless detailed study tips are asked).
4. If no exact match exists for the selected course in the catalog, honestly state that there isn't an exact listing for that code yet, suggest any closely related department/topic listings if helpful (or leave recommendedResourceIds empty if none relate), give 2-3 practical revision tips for that subject, and remind the student they can post a request or offer in the Study Hub.
5. Provide 2-3 short, actionable follow-up prompts in "suggestedFollowUps" relevant to the selected course.`;

      const contents = [
        ...history
          .filter((turn) => turn && typeof turn.text === 'string' && turn.text.trim().length > 0)
          .map((turn) => ({
            role: turn.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: turn.text.trim() }],
          })),
        {
          role: 'user',
          parts: [
            {
              text: `Selected course: ${selectedCourse} | Department: ${selectedDept}\nStudent question: ${message}`,
            },
          ],
        },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description:
                  'Concise, helpful recommendation of matching PSAS peer tutors or study materials and study guidance.',
              },
              recommendedResourceIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  'Exact IDs from the provided PSAS Study Catalog that match the request (max 4). Empty array if none apply.',
              },
              suggestedFollowUps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 to 3 short follow-up questions the student can tap next.',
              },
            },
            required: ['reply', 'recommendedResourceIds', 'suggestedFollowUps'],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      let parsed: {
        reply?: string;
        recommendedResourceIds?: unknown;
        suggestedFollowUps?: unknown;
      } = {};

      try {
        parsed = JSON.parse(rawText);
      } catch {
        parsed = {
          reply: rawText || 'Sorry, I could not format the study recommendations. Please try asking again.',
          recommendedResourceIds: [],
          suggestedFollowUps: [],
        };
      }

      const validIds = new Set(resources.map((r) => r.id));
      const recommendedResourceIds = Array.isArray(parsed.recommendedResourceIds)
        ? parsed.recommendedResourceIds
            .filter((id): id is string => typeof id === 'string' && validIds.has(id))
            .slice(0, 4)
        : [];

      const suggestedFollowUps = Array.isArray(parsed.suggestedFollowUps)
        ? parsed.suggestedFollowUps
            .filter((q): q is string => typeof q === 'string' && q.trim().length > 0)
            .slice(0, 3)
        : [];

      res.json({
        reply:
          typeof parsed.reply === 'string' && parsed.reply.trim()
            ? parsed.reply.trim()
            : 'Here is what I found for your course.',
        recommendedResourceIds,
        suggestedFollowUps,
      });
    } catch (err: unknown) {
      const errorObj = err as { status?: number; statusCode?: number; message?: string };
      const status =
        typeof errorObj?.status === 'number'
          ? errorObj.status
          : typeof errorObj?.statusCode === 'number'
          ? errorObj.statusCode
          : 500;

      console.error('Error in /api/study-ai:', errorObj?.message || err);

      let userMessage = 'Unable to reach the Study AI assistant right now. Please try again.';
      if (status === 403 || status === 400) {
        userMessage = errorObj?.message || 'AI request could not be completed. Please check server configuration.';
      } else if (status === 429) {
        userMessage = 'The Study AI service is receiving high traffic right now. Please wait a moment and try again.';
      } else if (errorObj?.message) {
        userMessage = errorObj.message;
      }

      res.status(status >= 400 && status < 600 ? status : 500).json({ error: userMessage });
    }
  });

  app.post('/api/marketplace-description-ai', async (req: Request, res: Response) => {
    try {
      const body = (req.body || {}) as {
        title?: string;
        category?: string;
        price?: string | number;
        condition?: string;
        pickupLocation?: string;
        existingDescription?: string;
        highlights?: string;
        tone?: 'friendly' | 'concise' | 'detailed';
        language?: 'en' | 'bm';
      };

      const title = typeof body.title === 'string' ? body.title.trim() : '';
      const category = typeof body.category === 'string' ? body.category.trim() : 'Student Essentials';
      const price = body.price !== undefined && body.price !== null ? String(body.price).trim() : '';
      const condition = typeof body.condition === 'string' ? body.condition.trim() : 'Good Condition';
      const pickupLocation =
        typeof body.pickupLocation === 'string' ? body.pickupLocation.trim() : 'PSAS Campus';
      const existingDescription =
        typeof body.existingDescription === 'string' ? body.existingDescription.trim() : '';
      const highlights = typeof body.highlights === 'string' ? body.highlights.trim() : '';
      const tone =
        body.tone === 'concise' || body.tone === 'detailed' ? body.tone : 'friendly';
      const language = body.language === 'bm' ? 'bm' : 'en';

      if (!title && !existingDescription && !highlights) {
        res.status(400).json({
          error: 'Please enter an Item Title or short notes first so the AI can write a description.',
        });
        return;
      }

      const ai = getAiClient();
      if (!ai) {
        res.status(500).json({
          error: 'Gemini API key is not configured on the server. Please set GEMINI_API_KEY in Secrets.',
        });
        return;
      }

      const toneGuide =
        tone === 'concise'
          ? 'Style: Short & crisp (30-50 words). Quick key details and pickup info.'
          : tone === 'detailed'
          ? 'Style: Detailed & structured (75-115 words). Short intro sentence plus 3-4 clean bullet points (using "• ") covering condition, usage/suitability for PSAS students, and meetup details.'
          : 'Style: Warm, persuasive, and campus-friendly (50-85 words). Natural paragraph highlighting student value, condition, and easy PSAS pickup.';

      const languageGuide =
        language === 'bm'
          ? 'Write the description and suggestedTitle in natural Bahasa Melayu (student-friendly Politeknik Malaysia tone, keeping product model names/codes intact).'
          : 'Write the description and suggestedTitle in clear, friendly English.';

      const systemInstruction = `You are an AI Listing Assistant for Campus Corner at Politeknik Sultan Azlan Shah (PSAS), Behrang, Perak.
Help student sellers write honest, compelling marketplace descriptions that help fellow PSAS students decide quickly.

Rules:
1. Only mention facts, accessories, or usage details provided by the seller. Never invent warranties, battery health, or unmentioned items.
2. Output plain text only for the description (no Markdown bold **, no # headers). Simple "• " bullets are allowed if using detailed style.
3. Include the item condition, practical value for PSAS students, and the campus meetup location naturally.
4. ${toneGuide}
5. ${languageGuide}
6. If the item appears prohibited on campus (weapons, drugs, vapes, exam leaks, assignment ghostwriting), politely state in "description" that the item cannot be listed under PSAS campus policy.`;

      const prompt = `Generate a marketplace listing description using these seller details:
- Item Title: ${title || '(Not specified yet)'}
- Category: ${category}
- Price: ${price ? `RM ${price}` : 'Not specified'}
- Condition: ${condition}
- PSAS Pickup Spot: ${pickupLocation}
- Seller Key Notes / Highlights: ${highlights || 'None provided'}
- Existing Draft to Improve/Rewrite: ${existingDescription || 'None (create from scratch)'}`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              description: {
                type: Type.STRING,
                description:
                  'Polished plain-text marketplace item description ready to paste into the listing form.',
              },
              suggestedTitle: {
                type: Type.STRING,
                description:
                  'A clear, catchy marketplace item title (keep close to the original title if already clear).',
              },
            },
            required: ['description', 'suggestedTitle'],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      let parsed: { description?: string; suggestedTitle?: string } = {};
      try {
        parsed = JSON.parse(rawText);
      } catch {
        parsed = { description: rawText, suggestedTitle: title };
      }

      const description =
        typeof parsed.description === 'string' && parsed.description.trim()
          ? parsed.description.trim()
          : '';
      const suggestedTitle =
        typeof parsed.suggestedTitle === 'string' && parsed.suggestedTitle.trim()
          ? parsed.suggestedTitle.trim()
          : title;

      if (!description) {
        res.status(502).json({ error: 'The AI returned an empty description. Please try again.' });
        return;
      }

      res.json({ description, suggestedTitle });
    } catch (err: unknown) {
      const errorObj = err as { status?: number; statusCode?: number; message?: string };
      const status =
        typeof errorObj?.status === 'number'
          ? errorObj.status
          : typeof errorObj?.statusCode === 'number'
          ? errorObj.statusCode
          : 500;

      console.error('Error in /api/marketplace-description-ai:', errorObj?.message || err);

      let userMessage = 'Unable to generate description right now. Please try again.';
      if (status === 429) {
        userMessage = 'AI service is busy right now. Please wait a moment and try again.';
      } else {
        userMessage = extractReadableAiError(err, userMessage);
      }

      res.status(status >= 400 && status < 600 ? status : 500).json({ error: userMessage });
    }
  });

  app.post('/api/marketplace-price-valuation-ai', async (req: Request, res: Response) => {
    try {
      const body = (req.body || {}) as {
        title?: string;
        category?: string;
        condition?: string;
        currentPrice?: string | number;
        description?: string;
        pickupLocation?: string;
        language?: 'en' | 'bm';
        imageDataUrl?: string;
        comparables?: Array<{
          title?: string;
          category?: string;
          condition?: string;
          price?: number;
        }>;
      };

      const title = typeof body.title === 'string' ? body.title.trim() : '';
      const category = typeof body.category === 'string' ? body.category.trim() : 'Student Essentials';
      const condition = typeof body.condition === 'string' ? body.condition.trim() : 'Good Condition';
      const description = typeof body.description === 'string' ? body.description.trim() : '';
      const pickupLocation =
        typeof body.pickupLocation === 'string' ? body.pickupLocation.trim() : 'PSAS Campus';
      const language = body.language === 'bm' ? 'bm' : 'en';
      const currentPriceNum =
        body.currentPrice !== undefined && body.currentPrice !== null && String(body.currentPrice).trim() !== ''
          ? Number(body.currentPrice)
          : null;
      const comparables = Array.isArray(body.comparables) ? body.comparables.slice(0, 8) : [];
      const imageDataUrl = typeof body.imageDataUrl === 'string' ? body.imageDataUrl.trim() : '';

      if (!title && !description && !imageDataUrl) {
        res.status(400).json({
          error: 'Please enter an Item Title (or upload a photo / notes) first so AI can estimate a fair RM price.',
        });
        return;
      }

      const ai = getAiClient();
      if (!ai) {
        res.status(500).json({
          error: 'Gemini API key is not configured on the server. Please set GEMINI_API_KEY in Secrets.',
        });
        return;
      }

      const comparablesText =
        comparables.length > 0
          ? JSON.stringify(
              comparables.map((c) => ({
                title: c.title,
                category: c.category,
                condition: c.condition,
                priceRM: c.price,
              }))
            )
          : 'None available in this category yet.';

      const languageGuide =
        language === 'bm'
          ? 'Write "pricingTip" in natural, friendly Bahasa Melayu suitable for Politeknik Sultan Azlan Shah (PSAS) students.'
          : 'Write "pricingTip" in clear, friendly English suitable for PSAS campus students.';

      const systemInstruction = `You are an AI Campus Price Valuation Specialist for Campus Corner at Politeknik Sultan Azlan Shah (PSAS), Behrang, Perak, Malaysia.
Estimate realistic, student-friendly secondhand/campus resale prices in Malaysian Ringgit (RM) for items traded peer-to-peer among polytechnic students.

Valuation Guidelines:
1. Base prices on realistic Malaysian retail prices (Shopee MY / Lazada MY / local electronics & bookstore prices) adjusted accurately for item condition:
   - Brand New: ~80%-92% of Malaysian retail
   - Like New: ~65%-80% of Malaysian retail
   - Good Condition: ~45%-65% of Malaysian retail
   - Fair Condition: ~30%-45% of Malaysian retail
2. Factor in accessories or defects mentioned in the description, as well as the live campus comparable listings provided.
3. Keep numbers whole RM values (or clean .00 integers) realistic for Malaysian student budgets. Ensure minPrice <= recommendedPrice <= maxPrice <= estimatedRetailPrice (unless rare/collectible).
4. ${languageGuide} Keep "pricingTip" concise (1-2 short sentences, max ~35 words) explaining the condition factor, retail comparison, or bundle value.`;

      const promptText = `Value this marketplace listing for a PSAS student seller:
- Item Title: ${title || '(Inspect attached photo if provided)'}
- Category: ${category}
- Condition: ${condition}
- Seller's Current Entered Price: ${
        currentPriceNum !== null && !Number.isNaN(currentPriceNum)
          ? `RM ${currentPriceNum}`
          : 'Not set yet'
      }
- Description / Included Accessories: ${description || 'None provided yet'}
- Pickup Location: ${pickupLocation}
- Active PSAS Marketplace Comparables: ${comparablesText}`;

      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
      if (imageDataUrl.startsWith('data:image/')) {
        const match = imageDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
        if (match) {
          parts.push({
            inlineData: {
              mimeType: match[1],
              data: match[2],
            },
          });
        }
      }
      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: { parts },
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedPrice: {
                type: Type.NUMBER,
                description: 'Best recommended selling price in Malaysian Ringgit (RM) for PSAS students.',
              },
              minPrice: {
                type: Type.NUMBER,
                description: 'Fast-sale / minimum fair negotiable price in RM.',
              },
              maxPrice: {
                type: Type.NUMBER,
                description: 'Upper fair resale price in RM.',
              },
              estimatedRetailPrice: {
                type: Type.NUMBER,
                description: 'Approximate brand-new Malaysian retail price in RM.',
              },
              demandLevel: {
                type: Type.STRING,
                description: 'One of: "High", "Moderate", or "Niche".',
              },
              pricingTip: {
                type: Type.STRING,
                description: 'Concise 1-2 sentence explanation of why this price range fits the PSAS campus market.',
              },
            },
            required: [
              'recommendedPrice',
              'minPrice',
              'maxPrice',
              'estimatedRetailPrice',
              'demandLevel',
              'pricingTip',
            ],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      let parsed: {
        recommendedPrice?: number;
        minPrice?: number;
        maxPrice?: number;
        estimatedRetailPrice?: number;
        demandLevel?: string;
        pricingTip?: string;
      } = {};

      try {
        parsed = JSON.parse(rawText);
      } catch {
        res.status(502).json({ error: 'Unable to parse AI price valuation. Please try again.' });
        return;
      }

      const rec = Math.max(1, Math.round(Number(parsed.recommendedPrice) || 25));
      const minP = Math.max(1, Math.min(rec, Math.round(Number(parsed.minPrice) || Math.round(rec * 0.8))));
      const maxP = Math.max(rec, Math.round(Number(parsed.maxPrice) || Math.round(rec * 1.15)));
      const retailP = Math.max(maxP, Math.round(Number(parsed.estimatedRetailPrice) || Math.round(maxP * 1.4)));

      const demandLevel: 'High' | 'Moderate' | 'Niche' =
        parsed.demandLevel === 'High' || parsed.demandLevel === 'Niche'
          ? parsed.demandLevel
          : 'Moderate';

      let priceAssessment: 'Great Deal' | 'Fair Campus Price' | 'Slightly High' | 'Not Set' = 'Not Set';
      if (currentPriceNum !== null && !Number.isNaN(currentPriceNum) && currentPriceNum > 0) {
        if (currentPriceNum < minP) {
          priceAssessment = 'Great Deal';
        } else if (currentPriceNum <= maxP) {
          priceAssessment = 'Fair Campus Price';
        } else {
          priceAssessment = 'Slightly High';
        }
      }

      res.json({
        recommendedPrice: rec,
        minPrice: minP,
        maxPrice: maxP,
        estimatedRetailPrice: retailP,
        demandLevel,
        priceAssessment,
        pricingTip:
          typeof parsed.pricingTip === 'string' && parsed.pricingTip.trim()
            ? parsed.pricingTip.trim()
            : `Fair PSAS student price for ${condition.toLowerCase()} ${category.toLowerCase()}.`,
      });
    } catch (err: unknown) {
      const errorObj = err as { status?: number; statusCode?: number; message?: string };
      const status =
        typeof errorObj?.status === 'number'
          ? errorObj.status
          : typeof errorObj?.statusCode === 'number'
          ? errorObj.statusCode
          : 500;

      console.error('Error in /api/marketplace-price-valuation-ai:', errorObj?.message || err);

      let userMessage = 'Unable to estimate price right now. Please try again.';
      if (status === 429) {
        userMessage = 'AI valuation service is busy right now. Please wait a moment and try again.';
      } else {
        userMessage = extractReadableAiError(err, userMessage);
      }

      res.status(status >= 400 && status < 600 ? status : 500).json({ error: userMessage });
    }
  });

  app.post('/api/prohibited-scan', async (req: Request, res: Response) => {
    try {
      const body = (req.body || {}) as {
        title?: string;
        description?: string;
        imageDataUrl?: string;
        imageUrl?: string;
      };

      const title = typeof body.title === 'string' ? body.title.trim() : '';
      const description = typeof body.description === 'string' ? body.description.trim() : '';
      const imageDataUrl = typeof body.imageDataUrl === 'string' ? body.imageDataUrl.trim() : '';
      const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : '';

      if (!title && !description && !imageDataUrl && !imageUrl) {
        res.json({ isBlocked: false });
        return;
      }

      const ai = getAiClient();
      if (!ai) {
        // If Gemini API key is absent, fail open gracefully for visual AI scan while client keyword checks still protect
        res.json({ isBlocked: false, skipped: true });
        return;
      }

      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

      let hasImage = false;
      const targetImage = imageDataUrl || imageUrl;

      if (targetImage.startsWith('data:image/')) {
        const match = targetImage.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
        if (match) {
          parts.push({
            inlineData: {
              mimeType: match[1],
              data: match[2],
            },
          });
          hasImage = true;
        }
      } else if (targetImage.startsWith('https://') || targetImage.startsWith('http://')) {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 5000);
          const imgRes = await fetch(targetImage, { signal: controller.signal });
          clearTimeout(timer);
          if (imgRes.ok) {
            const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
            if (contentType.startsWith('image/')) {
              const arrayBuf = await imgRes.arrayBuffer();
              if (arrayBuf.byteLength > 0 && arrayBuf.byteLength < 6 * 1024 * 1024) {
                parts.push({
                  inlineData: {
                    mimeType: contentType.split(';')[0],
                    data: Buffer.from(arrayBuf).toString('base64'),
                  },
                });
                hasImage = true;
              }
            }
          }
        } catch {
          // Ignore unreachable external URL and continue text check if provided
        }
      }

      if (!title && !description && !hasImage) {
        res.json({ isBlocked: false });
        return;
      }

      const textPrompt = `Inspect the provided ${hasImage ? 'product image' : ''}${
        hasImage && (title || description) ? ' and ' : ''
      }${title || description ? 'listing text' : ''} against Politeknik Sultan Azlan Shah (PSAS) Campus Corner Marketplace prohibited items rules.

Prohibited Categories (MUST BE BLOCKED):
1. Vapes, e-cigarettes, pods, disposables, e-liquids, cigarettes, tobacco, shisha, ketum, cannabis, illicit drugs, prescription pills.
2. Weapons & dangerous implements: knives, folding/tactical blades, kerambit, brass knuckles, pepper spray, stun guns/tasers, airsoft/BB guns, fireworks/firecrackers.
3. Academic dishonesty: leaked exam papers/answer schemes, paid assignment ghostwriting ("joki assignment/FYP"), stolen lecturer marksheets.
4. Alcohol & gambling: beer, wine, liquor, spirits, gambling chips, betting slips.
5. Counterfeit goods & pirated software: cracked AutoCAD/SolidWorks/MATLAB keys, fake student matrix cards.
6. Prohibited high-wattage hostel heating hazards: immersion water heater coils ("pemanas air celup"), dorm induction/hotplate cookers.

Allowed Student Items (DO NOT BLOCK):
- Scientific calculators, Arduino/electronics kits, textbooks, lecture notes, clothing/lab coats, wireless mice, laptops, domestic steam irons, stationery, backpacks, sports gear.

Listing Title: ${title || '(none)'}
Listing Description: ${description || '(none)'}`;

      parts.push({ text: textPrompt });

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: { parts },
        config: {
          systemInstruction:
            'You are an automated campus marketplace compliance scanner. Be accurate: block genuinely prohibited items visually or textually, and allow normal academic/student items.',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isBlocked: {
                type: Type.BOOLEAN,
                description: 'True only if the image or text depicts or offers a prohibited item.',
              },
              category: {
                type: Type.STRING,
                description: 'Short prohibited category name if blocked, otherwise empty string.',
              },
              detectedWord: {
                type: Type.STRING,
                description: 'Short label of the detected prohibited product (e.g., "Vape Pod Device", "Folding Knife", "Beer Bottle").',
              },
              reason: {
                type: Type.STRING,
                description: 'Clear 1-sentence explanation why this product is not allowed in the PSAS marketplace.',
              },
              source: {
                type: Type.STRING,
                description: '"image" if detected in the uploaded photo, otherwise "text".',
              },
            },
            required: ['isBlocked', 'category', 'detectedWord', 'reason', 'source'],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      let parsed: {
        isBlocked?: boolean;
        category?: string;
        detectedWord?: string;
        reason?: string;
        source?: string;
      } = {};

      try {
        parsed = JSON.parse(rawText);
      } catch {
        parsed = { isBlocked: false };
      }

      if (parsed.isBlocked) {
        res.json({
          isBlocked: true,
          category: parsed.category || 'Prohibited Campus Item',
          detectedWord: parsed.detectedWord || 'Prohibited Product',
          reason:
            parsed.reason ||
            'This product is not allowed to be sold or published in the PSAS Campus Corner Marketplace.',
          source: parsed.source === 'image' || hasImage ? 'image' : 'text',
        });
        return;
      }

      res.json({ isBlocked: false });
    } catch (err: unknown) {
      console.error('Error in /api/prohibited-scan:', (err as Error)?.message || err);
      res.status(500).json({
        error: 'Unable to complete prohibited item scan right now.',
      });
    }
  });

  app.post('/api/marketplace-trends-ai', async (req: Request, res: Response) => {
    try {
      const body = (req.body || {}) as {
        listings?: Array<{
          id?: string;
          title?: string;
          category?: string;
          price?: number;
          condition?: string;
          views?: number;
          status?: string;
          createdAt?: string;
        }>;
        transactions?: Array<{
          itemTitle?: string;
          offerAmount?: number;
          status?: string;
        }>;
        focusCategory?: string;
        userDepartment?: string;
        language?: 'en' | 'bm';
      };

      const ai = getAiClient();
      if (!ai) {
        res.status(500).json({
          error: 'Gemini API key is not configured on the server. Please set GEMINI_API_KEY in Secrets.',
        });
        return;
      }

      const VALID_CATEGORIES = [
        'Engineering Tools',
        'Electronics & Gadgets',
        'Textbooks & Academic',
        'Clothing & Attire',
        'Student Essentials',
        'Student Services',
      ] as const;

      const VALID_CONDITIONS = [
        'Brand New',
        'Like New',
        'Good Condition',
        'Fair Condition',
      ] as const;

      const listings = Array.isArray(body.listings) ? body.listings.slice(0, 40) : [];
      const transactions = Array.isArray(body.transactions) ? body.transactions.slice(0, 25) : [];
      const focusCategory =
        typeof body.focusCategory === 'string' && body.focusCategory.trim()
          ? body.focusCategory.trim()
          : 'All';
      const userDepartment =
        typeof body.userDepartment === 'string' && body.userDepartment.trim()
          ? body.userDepartment.trim()
          : 'PSAS Student';
      const language = body.language === 'bm' ? 'bm' : 'en';

      // Build compact aggregate stats per category for accurate grounding
      const categoryAggregates = VALID_CATEGORIES.map((cat) => {
        const items = listings.filter((l) => l.category === cat);
        const totalViews = items.reduce((sum, item) => sum + (Number(item.views) || 0), 0);
        const avgPriceRM =
          items.length > 0
            ? Math.round(items.reduce((sum, item) => sum + (Number(item.price) || 0), 0) / items.length)
            : 0;
        const avgViewsPerItem = items.length > 0 ? Math.round(totalViews / items.length) : 0;
        return {
          category: cat,
          activeSupplyCount: items.length,
          totalViews,
          avgViewsPerItem,
          avgPriceRM,
        };
      });

      const languageGuide =
        language === 'bm'
          ? 'Write headlineInsight, campusMomentumNote, categoryTrends[].insight, highDemandSuggestions[].whyItSells, and starterDescription in natural, friendly Bahasa Melayu (Politeknik Malaysia student tone, keeping product codes/names clear).'
          : 'Write headlineInsight, campusMomentumNote, categoryTrends[].insight, highDemandSuggestions[].whyItSells, and starterDescription in clear, actionable English tailored to PSAS students.';

      const systemInstruction = `You are an AI Campus Marketplace Analytics Advisor for Politeknik Sultan Azlan Shah (PSAS), Behrang, Perak, Malaysia.
Analyze live campus listings, view counts, category supply vs engagement, and recent transactions to identify sales trends and recommend specific, high-demand items PSAS students can sell profitably and quickly.

Rules:
1. Only suggest safe, academic-friendly, PSAS-compliant student items (NO vapes, weapons, drugs, alcohol, exam leaks, assignment ghostwriting, or high-wattage hostel heaters).
2. Ground your trend insights in the provided live category aggregates, listing views, and transactions, while identifying supply gaps (categories or essential student items with high demand/views but low supply).
3. Use ONLY these exact category names in hotCategory, categoryTrends[].category, and highDemandSuggestions[].category:
   - "Engineering Tools"
   - "Electronics & Gadgets"
   - "Textbooks & Academic"
   - "Clothing & Attire"
   - "Student Essentials"
   - "Student Services"
4. Focus Category filter: ${focusCategory === 'All' ? 'All categories (diverse top opportunities across campus)' : `Prioritize opportunities within or strongly linked to "${focusCategory}" (at least 3 of the 4 suggested items should be in "${focusCategory}")`}.
5. Keep prices realistic in Malaysian Ringgit (RM) for polytechnic student budgets (minPriceRM <= recommendedPriceRM <= maxPriceRM).
6. ${languageGuide}`;

      const prompt = `Analyze this live PSAS Student Marketplace snapshot (Student context: ${userDepartment}):

Category Performance Aggregates:
${JSON.stringify(categoryAggregates)}

Live Marketplace Listings (sample):
${JSON.stringify(
  listings.map((l) => ({
    title: l.title,
    category: l.category,
    priceRM: l.price,
    condition: l.condition,
    views: l.views,
    status: l.status,
  }))
)}

Recent Offers & Completed Transactions:
${JSON.stringify(
  transactions.map((t) => ({
    itemTitle: t.itemTitle,
    offerAmountRM: t.offerAmount,
    status: t.status,
  }))
)}

Return:
- A crisp headlineInsight and campusMomentumNote
- hotCategory and peakPriceSweetSpot
- 5 categoryTrends covering the top marketplace categories (ordered by demandScore descending)
- 4 highDemandSuggestions for specific items students should consider selling right now (including a starterDescription ready to pre-fill the listing form).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headlineInsight: {
                type: Type.STRING,
                description: 'Concise 1-2 sentence summary of current campus marketplace buying & selling trends.',
              },
              hotCategory: {
                type: Type.STRING,
                description: 'Exact name of the fastest-moving Marketplace category right now.',
              },
              peakPriceSweetSpot: {
                type: Type.STRING,
                description: 'Most active student budget range in RM, e.g. "RM 20 – RM 65".',
              },
              campusMomentumNote: {
                type: Type.STRING,
                description: 'Short 1-sentence note explaining current semester/campus demand drivers.',
              },
              categoryTrends: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    demandScore: { type: Type.NUMBER, description: 'Demand index from 1 to 100.' },
                    trendDirection: { type: Type.STRING, description: '"rising", "steady", or "cooling".' },
                    avgPriceRM: { type: Type.NUMBER },
                    insight: { type: Type.STRING, description: 'Brief 8-14 word trend takeaway.' },
                  },
                  required: ['category', 'demandScore', 'trendDirection', 'avgPriceRM', 'insight'],
                },
              },
              highDemandSuggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: 'Specific marketable item title for PSAS students.' },
                    category: { type: Type.STRING },
                    recommendedPriceRM: { type: Type.NUMBER },
                    minPriceRM: { type: Type.NUMBER },
                    maxPriceRM: { type: Type.NUMBER },
                    demandLevel: { type: Type.STRING, description: '"Very High", "High", or "Rising".' },
                    suggestedCondition: {
                      type: Type.STRING,
                      description: '"Brand New", "Like New", "Good Condition", or "Fair Condition".',
                    },
                    whyItSells: { type: Type.STRING, description: 'Concise 1-sentence reason why students buy this.' },
                    starterDescription: {
                      type: Type.STRING,
                      description: 'Helpful 2-sentence plain-text starter listing description.',
                    },
                  },
                  required: [
                    'title',
                    'category',
                    'recommendedPriceRM',
                    'minPriceRM',
                    'maxPriceRM',
                    'demandLevel',
                    'suggestedCondition',
                    'whyItSells',
                    'starterDescription',
                  ],
                },
              },
            },
            required: [
              'headlineInsight',
              'hotCategory',
              'peakPriceSweetSpot',
              'campusMomentumNote',
              'categoryTrends',
              'highDemandSuggestions',
            ],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      let parsed: Record<string, unknown> = {};
      try {
        parsed = JSON.parse(rawText);
      } catch {
        res.status(502).json({ error: 'Unable to parse AI market trends. Please try refreshing.' });
        return;
      }

      const normalizeCategory = (cat: unknown): (typeof VALID_CATEGORIES)[number] => {
        if (typeof cat === 'string') {
          const found = VALID_CATEGORIES.find((v) => v.toLowerCase() === cat.trim().toLowerCase());
          if (found) return found;
        }
        return 'Student Essentials';
      };

      const normalizeCondition = (cond: unknown): (typeof VALID_CONDITIONS)[number] => {
        if (typeof cond === 'string') {
          const found = VALID_CONDITIONS.find((v) => v.toLowerCase() === cond.trim().toLowerCase());
          if (found) return found;
        }
        return 'Good Condition';
      };

      const rawTrends = Array.isArray(parsed.categoryTrends) ? parsed.categoryTrends : [];
      const categoryTrends = rawTrends
        .slice(0, 6)
        .map((t: Record<string, unknown>) => {
          const score = Math.max(10, Math.min(100, Math.round(Number(t?.demandScore) || 70)));
          const dir =
            t?.trendDirection === 'rising' || t?.trendDirection === 'cooling'
              ? t.trendDirection
              : 'steady';
          const avgPrice = Math.max(5, Math.round(Number(t?.avgPriceRM) || 30));
          return {
            category: normalizeCategory(t?.category),
            demandScore: score,
            trendDirection: dir as 'rising' | 'steady' | 'cooling',
            avgPriceRM: avgPrice,
            insight:
              typeof t?.insight === 'string' && t.insight.trim()
                ? t.insight.trim()
                : 'Steady student demand throughout the semester.',
          };
        });

      const rawSuggestions = Array.isArray(parsed.highDemandSuggestions)
        ? parsed.highDemandSuggestions
        : [];
      const highDemandSuggestions = rawSuggestions
        .slice(0, 4)
        .map((s: Record<string, unknown>) => {
          const rec = Math.max(2, Math.round(Number(s?.recommendedPriceRM) || 35));
          const minP = Math.max(1, Math.min(rec, Math.round(Number(s?.minPriceRM) || Math.round(rec * 0.8))));
          const maxP = Math.max(rec, Math.round(Number(s?.maxPriceRM) || Math.round(rec * 1.2)));
          const demandLevel =
            s?.demandLevel === 'Very High' || s?.demandLevel === 'Rising'
              ? s.demandLevel
              : 'High';
          return {
            title:
              typeof s?.title === 'string' && s.title.trim()
                ? s.title.trim()
                : 'Essential PSAS Student Item',
            category: normalizeCategory(s?.category),
            recommendedPriceRM: rec,
            minPriceRM: minP,
            maxPriceRM: maxP,
            demandLevel: demandLevel as 'Very High' | 'High' | 'Rising',
            suggestedCondition: normalizeCondition(s?.suggestedCondition),
            whyItSells:
              typeof s?.whyItSells === 'string' && s.whyItSells.trim()
                ? s.whyItSells.trim()
                : 'Popular among PSAS students for daily classes and coursework.',
            starterDescription:
              typeof s?.starterDescription === 'string' && s.starterDescription.trim()
                ? s.starterDescription.trim()
                : 'Well-maintained item ready for quick campus pickup at Perpustakaan PSAS.',
          };
        });

      res.json({
        headlineInsight:
          typeof parsed.headlineInsight === 'string' && parsed.headlineInsight.trim()
            ? parsed.headlineInsight.trim()
            : 'Engineering gear and electronics continue to lead PSAS student demand.',
        hotCategory: normalizeCategory(parsed.hotCategory),
        peakPriceSweetSpot:
          typeof parsed.peakPriceSweetSpot === 'string' && parsed.peakPriceSweetSpot.trim()
            ? parsed.peakPriceSweetSpot.trim()
            : 'RM 20 – RM 65',
        campusMomentumNote:
          typeof parsed.campusMomentumNote === 'string' && parsed.campusMomentumNote.trim()
            ? parsed.campusMomentumNote.trim()
            : 'Students are actively looking for affordable semester essentials and lab equipment.',
        categoryTrends,
        highDemandSuggestions,
        analyzedAt: new Date().toISOString(),
      });
    } catch (err: unknown) {
      const errorObj = err as { status?: number; statusCode?: number; message?: string };
      const status =
        typeof errorObj?.status === 'number'
          ? errorObj.status
          : typeof errorObj?.statusCode === 'number'
          ? errorObj.statusCode
          : 500;

      console.error('Error in /api/marketplace-trends-ai:', errorObj?.message || err);

      let userMessage = 'Unable to analyze marketplace trends right now. Please try again.';
      if (status === 429) {
        userMessage = 'AI trends service is busy right now. Please wait a moment and try again.';
      } else {
        userMessage = extractReadableAiError(err, userMessage);
      }

      res.status(status >= 400 && status < 600 ? status : 500).json({ error: userMessage });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      const indexFile = path.join(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Campus Corner server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Campus Corner server:', err);
  process.exit(1);
});
