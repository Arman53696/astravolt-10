import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.nexora.astravolt",
  appName: "Astravolt",
  // The game is a single self-contained HTML file bundled into the APK,
  // so the app works fully offline.
  webDir: "public/game",
  android: {
    backgroundColor: "#010206",
  },
  server: {
    androidScheme: "https",
  },
};

export default config;
