/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SPIRAL_IMAGES_PATH: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
