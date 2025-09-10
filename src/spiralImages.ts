// Import the images directly to handle them as assets through Vite's asset handling
// This allows Vite to handle the assets properly in development mode
import offsetSpiralImg from '/public/spirals/offset-spiral.png';
import xmapSpiralImg from '/public/spirals/xmap_spiral.png';

const isDevelopment = import.meta.env.DEV;

// In development mode, use the imported assets
// In production mode, use the URLs from .env
export const spiralImages = isDevelopment 
  ? [offsetSpiralImg, xmapSpiralImg]  
  : [
      `${import.meta.env.VITE_SPIRAL_IMAGES_PATH}/offset-spiral.png`,
      `${import.meta.env.VITE_SPIRAL_IMAGES_PATH}/xmap_spiral.png`
    ];
