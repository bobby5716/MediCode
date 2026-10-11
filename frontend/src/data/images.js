// =============================================================
//  All website images live here.
//  Change a URL → it updates everywhere it's used.
// =============================================================

// ScrollExpand — the full-bleed reveal image
export const SCROLL_EXPAND_IMAGE =
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80&auto=format&fit=crop';

// Circular Gallery — 5 module cards
export const MODULE_IMAGES = {
  clinicalNotes:    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop',
  labExplainer:     'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80&auto=format&fit=crop',
  smartTriage:      'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80&auto=format&fit=crop',
  medicationCheck:  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80&auto=format&fit=crop',
  resourceForecast: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop',
};

// Infinite Spiral — tech stack tiles
// Simple Icons CDN: colored SVG logos, guaranteed to render
// Format: https://cdn.simpleicons.org/<slug>/<hexColor>
const tile = (label, bg) =>
  `https://placehold.co/240x240/${bg}/ffffff/png?text=${encodeURIComponent(label)}&font=montserrat`;

export const STACK_IMAGES = {
  mongodb:  'https://cdn.simpleicons.org/mongodb/00ED64',
  express:  'https://cdn.simpleicons.org/express/ffffff',
  react:    'https://cdn.simpleicons.org/react/61DAFB',
  node:     'https://cdn.simpleicons.org/nodedotjs/68A063',
  groq:     tile('Groq',  'F55036'),    // ← fallback tile
  llama:    tile('Llama', '8b5cf6'),    // ← fallback tile
  three:    'https://cdn.simpleicons.org/threedotjs/ffffff',
  vite:     'https://cdn.simpleicons.org/vite/646CFF',
};

// Logo loop — brand names (text-based, no image needed but here for future)
export const LOGO_LOOP_TEXT = [
  'Groq', 'MongoDB', 'Express', 'React', 'Node.js',
  'Three.js', 'Vite', 'Tailwind', 'Llama 3.3',
];

// If you ever want to swap logo loop to real images, use these:
export const LOGO_LOOP_IMAGES = [];