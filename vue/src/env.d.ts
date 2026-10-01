/// <reference types="vite/client" />

// strictTemplates rejects unknown attributes; allow any data-* attribute on native elements.
declare module 'vue' {
  interface HTMLAttributes {
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
}

export {};
