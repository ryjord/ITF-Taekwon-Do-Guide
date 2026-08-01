// Real-world ITF belt colours (not the app's brand palette) — these classes
// render what colour a belt actually is, so they intentionally use literal
// Tailwind colour swatches rather than design tokens. Two naming schemes are
// used across the app's data files (Patterns.json's beltColor uses "White
// with Yellow Stripe", TerminologyData.json's beltLearnt uses "White-Yellow"),
// so both are mapped to the same class strings here.
const BELT_COLOR_CLASSES = {
  White: 'bg-white border-gray-300 text-gray-800',
  Yellow: 'bg-yellow-400 border-yellow-500 text-yellow-900',
  Green: 'bg-green-500 border-green-600 text-white',
  Blue: 'bg-blue-500 border-blue-600 text-white',
  Red: 'bg-red-500 border-red-600 text-white',
  Black: 'bg-black border-gray-800 text-white',

  'White with Yellow Stripe':
    'bg-linear-to-r from-white from-70% to-yellow-400 to-70% border-gray-300 text-gray-800',
  'Yellow with Green Stripe':
    'bg-linear-to-r from-yellow-400 from-70% to-green-500 to-70% border-yellow-500 text-white',
  'Green with Blue Stripe':
    'bg-linear-to-r from-green-500 from-70% to-blue-500 to-70% border-green-600 text-white',
  'Blue with Red Stripe':
    'bg-linear-to-r from-blue-500 from-70% to-red-500 to-70% border-blue-600 text-white',
  'Red with Black Stripe':
    'bg-linear-to-r from-red-500 from-70% to-black to-70% border-red-600 text-white',

  'White-Yellow': 'bg-linear-to-r from-white from-70% to-yellow-400 to-70% border-gray-300 text-gray-800',
  'Yellow-Green': 'bg-linear-to-r from-yellow-400 from-70% to-green-500 to-70% border-yellow-500 text-white',
  'Green-Blue': 'bg-linear-to-r from-green-500 from-70% to-blue-500 to-70% border-green-600 text-white',
  'Blue-Red': 'bg-linear-to-r from-blue-500 from-70% to-red-500 to-70% border-blue-600 text-white',
  'Red-Black': 'bg-linear-to-r from-red-500 from-70% to-black to-70% border-red-600 text-white',
}

const FALLBACK_CLASS = 'bg-muted border-border text-foreground'

export const getBeltColorClass = (beltColor) => BELT_COLOR_CLASSES[beltColor] ?? FALLBACK_CLASS
