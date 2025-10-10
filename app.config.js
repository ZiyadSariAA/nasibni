import 'dotenv/config';

export default {
  expo: {
    name: "ناسبني",
    slug: "nasibni",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/logos/Logo1.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    scheme: "nasibni",
    splash: {
      image: "./src/assets/logos/Logo1.png",
      resizeMode: "contain",
      backgroundColor: "#FFFFFF"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.nasibni.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./src/assets/logos/Logo1.png",
        backgroundColor: "#FFFFFF"
      },
      edgeToEdgeEnabled: true,
      package: "com.nasibni.app"
    },
    web: {
      favicon: "./src/assets/logos/Logo1.png",
      bundler: "metro"
    },
    plugins: [
      "expo-font",
      "expo-web-browser"
    ],
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
    }
  }
};
