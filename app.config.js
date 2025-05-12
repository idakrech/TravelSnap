import "dotenv/config";

export default {
  expo: {
    name: "TravelSnap",
    slug: "travelsnap",
    version: "1.0.0",
    jsEngine: "hermes",
    orientation: "portrait",
    icon: "./assets/icon.png", 
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",        
      backgroundColor: "#f7ded1",   
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
    ],
    ios: {
      bundleIdentifier: "com.yourcompany.travelsnap",
      buildNumber: "1.0.0",
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "This app needs access to your location to show maps and location-based features.",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "This app needs access to your location to show maps and location-based features.",
        NSLocationAlwaysUsageDescription:
          "This app needs access to your location to show maps and location-based features.",
      },
    },
    android: {
      package: "com.yourcompany.travelsnap",
      versionCode: 1,
      permissions: ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
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
