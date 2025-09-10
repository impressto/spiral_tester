// Import the images directly to handle them as assets through Vite's asset handling
// This allows Vite to handle the assets properly in development mode
// Files in public directory should be referenced without the /public prefix
import offsetSpiralImg from '/spirals/offset-spiral.png?url';
import xmapSpiralImg from '/spirals/xmap_spiral.png?url';
import neonSpiralImg from '/spirals/neon_spiral.png?url';
import squareSpiralImg from '/spirals/square_spiral.png?url';
import reversingSpiralImg from '/spirals/reversing_spiral.png?url';
import galaxySpiralImg from '/spirals/galaxy-spiral.png?url';

const isDevelopment = import.meta.env.DEV;

// In development mode, use the imported assets
// In production mode, use the URLs from .env
export const spiralImages = isDevelopment 
  ? [offsetSpiralImg, xmapSpiralImg, neonSpiralImg, squareSpiralImg, reversingSpiralImg, galaxySpiralImg]  
  : [
      `${import.meta.env.VITE_SPIRAL_IMAGES_PATH}/offset-spiral.png`,
      `${import.meta.env.VITE_SPIRAL_IMAGES_PATH}/xmap_spiral.png`,
      `${import.meta.env.VITE_SPIRAL_IMAGES_PATH}/neon_spiral.png`,
      `${import.meta.env.VITE_SPIRAL_IMAGES_PATH}/square_spiral.png`,
      `${import.meta.env.VITE_SPIRAL_IMAGES_PATH}/reversing_spiral.png`,
      `${import.meta.env.VITE_SPIRAL_IMAGES_PATH}/galaxy-spiral.png`
    ];
