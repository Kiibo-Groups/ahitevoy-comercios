import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ahitevoy.negocios',
  appName: 'AhiTeVoy Negocios',
  webDir: 'www',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: "DARK",
      backgroundColor: "#ffffffff",
    },
  },
  ios: {
    handleApplicationNotifications: false
  }
};

export default config;
