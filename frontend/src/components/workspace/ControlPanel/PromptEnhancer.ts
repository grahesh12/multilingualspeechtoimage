export interface AdvancedSettingsData {
  cameraAngle: string;
  lighting: string;
  colorPalette: string;
  background: string;
  emotion: string;
  weather: string;
  timeOfDay: string;
  material: string;
  lensType: string;
  perspective: string;
}

export function enhancePromptWithAdvancedSettings(basePrompt: string, settings: AdvancedSettingsData): string {
  const enhancements = [];
  // Add camera angle
  if (settings.cameraAngle !== 'front-view') {
    const angleMap: { [key: string]: string } = {
      'side-view': 'side view',
      'top-view': 'top-down view',
      'isometric': 'isometric perspective',
      'over-shoulder': 'over-the-shoulder view',
      'close-up': 'close-up shot',
      'wide-angle': 'wide angle shot',
      'birds-eye': "bird's eye view",
      'worms-eye': "worm's eye view",
      'tilted': 'tilted angle'
    };
    enhancements.push(angleMap[settings.cameraAngle] || settings.cameraAngle);
  }
  // Add lighting
  if (settings.lighting !== 'natural') {
    const lightingMap: { [key: string]: string } = {
      'studio-light': 'studio lighting',
      'backlit': 'backlit',
      'soft-diffused': 'soft diffused lighting',
      'cinematic': 'cinematic lighting',
      'sunset-glow': 'sunset glow',
      'harsh-shadows': 'harsh shadows',
      'neon': 'neon lighting',
      'monochrome': 'monochrome lighting'
    };
    enhancements.push(lightingMap[settings.lighting] || settings.lighting);
  }
  // Add color palette
  if (settings.colorPalette !== 'vibrant') {
    enhancements.push(`${settings.colorPalette} colors`);
  }
  // Add background
  if (settings.background !== 'nature') {
    const backgroundMap: { [key: string]: string } = {
      'transparent': 'isolated on transparent background',
      'urban': 'urban background',
      'blurred': 'blurred background',
      'abstract-shapes': 'abstract background',
      'studio-background': 'studio background',
      'gradient-color': 'gradient background',
      'custom-color': 'solid color background'
    };
    enhancements.push(backgroundMap[settings.background] || `${settings.background} background`);
  }
  // Add emotion/mood
  if (settings.emotion !== 'happy') {
    enhancements.push(`${settings.emotion} mood`);
  }
  // Add weather
  if (settings.weather !== 'sunny') {
    enhancements.push(`${settings.weather} weather`);
  }
  // Add time of day
  if (settings.timeOfDay !== 'afternoon') {
    const timeMap: { [key: string]: string } = {
      'golden-hour': 'golden hour',
      'time-of-day': settings.timeOfDay
    };
    enhancements.push(timeMap[settings.timeOfDay] || settings.timeOfDay);
  }
  // Add material
  if (settings.material !== 'mixed') {
    enhancements.push(`${settings.material} materials`);
  }
  // Add lens type
  if (settings.lensType !== '50mm-standard') {
    const lensMap: { [key: string]: string } = {
      'wide-angle': 'wide angle lens',
      'telephoto': 'telephoto lens',
      'macro': 'macro lens',
      'fisheye': 'fisheye lens',
      'drone-view': 'drone photography',
      'depth-blur': 'shallow depth of field'
    };
    enhancements.push(lensMap[settings.lensType] || settings.lensType);
  }
  // Add perspective
  if (settings.perspective !== 'eye-level') {
    const perspectiveMap: { [key: string]: string } = {
      'birds-eye': "bird's eye perspective",
      'worms-eye': "worm's eye perspective",
      'tilted-perspective': 'tilted perspective',
      'dynamic-perspective': 'dynamic perspective',
      'over-shoulder': 'over-the-shoulder perspective'
    };
    enhancements.push(perspectiveMap[settings.perspective] || settings.perspective);
  }
  // Combine base prompt with enhancements
  if (enhancements.length > 0) {
    return `${basePrompt}, ${enhancements.join(', ')}`;
  }
  return basePrompt;
} 