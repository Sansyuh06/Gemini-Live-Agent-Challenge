const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface GenerateImageParams {
  prompt: string;
  negativePrompt?: string;
  styles?: string[];
  aspectRatio?: string;
  imageNumber?: number;
  seed?: number;
}

export interface FooocusStatus {
  online: boolean;
  version?: string;
}

// Child-safe prompt enforcement
const SAFETY_PREFIX = 'child-friendly, safe for kids, cute, colorful, wholesome, ';
const SAFETY_NEGATIVE = 'nsfw, violent, scary, blood, weapon, gore, nude, adult content, dark, horror';

export async function checkFooocusHealth(): Promise<FooocusStatus> {
  try {
    const res = await fetch(`${API_BASE}/api/fooocus/health`, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      return { online: data.online, version: 'Fooocus' };
    }
    return { online: false };
  } catch {
    return { online: false };
  }
}

export async function generateImage(params: GenerateImageParams): Promise<string[]> {
  const safePrompt = SAFETY_PREFIX + params.prompt;

  try {
    // Route through backend server which has proper Fooocus Gradio integration
    const res = await fetch(`${API_BASE}/api/fooocus/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imagePrompt: safePrompt,
        styles: params.styles || ['Fooocus Lighting'],
      }),
    });

    if (!res.ok) {
      throw new Error(`Backend API error: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success && Array.isArray(data.images)) {
      return data.images;
    }
    
    return [];
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
}

// Pre-built kid-friendly prompt suggestions
export const PROMPT_SUGGESTIONS = [
  { label: '🦄 Magical Unicorn', prompt: 'A beautiful unicorn in a magical rainbow forest with sparkles and butterflies' },
  { label: '🐉 Friendly Dragon', prompt: 'A cute friendly dragon reading a book in a cozy cave with crystals' },
  { label: '🏰 Fantasy Castle', prompt: 'A magical fairy tale castle on a cloud with rainbow bridges and flying birds' },
  { label: '🚀 Space Adventure', prompt: 'A cute astronaut kid exploring a colorful planet with friendly aliens' },
  { label: '🌊 Ocean Friends', prompt: 'Friendly sea creatures having a party underwater with coral reefs and bubbles' },
  { label: '🌸 Enchanted Garden', prompt: 'A magical garden with talking flowers, tiny fairies, and glowing mushrooms' },
  { label: '🎪 Circus Fun', prompt: 'A colorful circus tent with acrobat animals and juggling clowns, festive atmosphere' },
  { label: '🦁 Safari Friends', prompt: 'Cute baby animals on a safari adventure in the savanna with a beautiful sunset' },
  { label: '🎨 Art World', prompt: 'A world made of paint and crayons where everything is colorful and creative' },
  { label: '🏠 Treehouse', prompt: 'An amazing treehouse village with rope bridges, slides, and lanterns at golden hour' },
];

export const STYLE_OPTIONS = [
  { label: '💡 Lighting', value: 'Fooocus Lighting' },
  { label: '🎨 Cartoon', value: 'Fooocus V2' },
  { label: '🖌️ Watercolor', value: 'Watercolor 2' },
  { label: '📚 Storybook', value: 'Artstyle Watercolor' },
  { label: '🎮 Pixel Art', value: 'Misc Pixel Art' },
  { label: '✏️ Pencil Sketch', value: 'Pencil Sketch Drawing' },
  { label: '🌟 Fantasy', value: 'Game Fantasy Game' },
  { label: '📸 3D Render', value: 'SAI 3D Model' },
  { label: '🎭 Anime', value: 'SAI Anime' },
];

export const ASPECT_RATIOS = [
  { label: '11:21 Portrait', value: '704×1344' },
  { label: '1:1 Square', value: '1024×1024' },
  { label: '3:2 Landscape', value: '1152×896' },
  { label: '2:3 Portrait', value: '896×1152' },
  { label: '16:9 Wide', value: '1344×768' },
  { label: '9:16 Tall', value: '768×1344' },
];
