import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.DailyCal',
  appName: 'DailyCal Flow',
  webDir: 'out',  // Static output dir
  // Remove the entire 'server' block for production AAB
};

export default config;