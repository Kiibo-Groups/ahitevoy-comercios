import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ahitevoy.negocios',
  appName: 'AhiTeVoy Negocios',
  webDir: 'www',

  ios: {
    handleApplicationNotifications: false
  }
};

export default config;
