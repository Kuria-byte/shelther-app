interface Brightness {
  set: (value: number) => Promise<void>;
  get: () => Promise<number>;
}

interface Screen {
  brightness: Brightness;
  keepAwake: boolean;
}

interface Navigator {
  wakeLock?: {
    request: (type: 'screen') => Promise<any>;
  }
}

interface Window {
  screen: Screen;
}
