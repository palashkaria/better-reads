// add countObserver to window

declare global {
  interface Window {
    countObserver?: MutationObserver;
  }
}

export {};
