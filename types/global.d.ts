// Move the contents of frontend/types/global.d.ts here
/// <reference types="react" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// ... rest of the file content ...