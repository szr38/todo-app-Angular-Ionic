export {};

declare global {
  interface Window {
    cordova?: unknown;
    StatusBar?: {
      overlaysWebView(overlay: boolean): void;
      styleDefault(): void;
      styleLightContent(): void;
      backgroundColorByHexString(color: string): void;
    };
  }

  interface Navigator {
    splashscreen?: {
      hide(): void;
    };
  }

  const device: {
    platform: 'iOS' | 'Android' | string;
  };

  const Keyboard: {
    hideFormAccessoryBar(hide: boolean): void;
  };
}
