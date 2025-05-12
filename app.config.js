import "dotenv/config";

export default {
  expo: {
    name: "TravelSnap",
    slug: "travelsnap",
    version: "1.0.0",
    orientation: "portrait",
    jsEngine: "hermes",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/standing_logo.png",
      resizeMode: "contain",      // <-- Utrzymanie proporcji
      backgroundColor: "#ffc0a0", // <-- Kolor tła
    },
    plugins: [
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
          },
        },
      ],
      [
        "expo-splash-screen",
        {
          backgroundColor: "#ffc0a0",
          image: "./assets/standing_logo.png",
          imageWidth: 200,
        },
      ],
    ],
    ios: {
      bundleIdentifier: "com.yourcompany.travelsnap",
      buildNumber: "1.0.0",
      supportsTablet: true,
    },
    android: {
      package: "com.yourcompany.travelsnap",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#ffffff",
      },
    },
    extra: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    },
  },
};
