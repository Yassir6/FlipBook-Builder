/// <reference types="vite/client" />

declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module 'page-flip/dist/js/page-flip.browser.js?raw' {
  const content: string;
  export default content;
}
