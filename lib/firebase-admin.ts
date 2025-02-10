import { initializeApp, getApps, cert } from "firebase-admin/app";

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
};

export function initFirebaseAdmin() {
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set");
  }
  if (!process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
    throw new Error("FIREBASE_ADMIN_CLIENT_EMAIL is not set");
  }
  if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    throw new Error("FIREBASE_ADMIN_PRIVATE_KEY is not set");
  }

  if (!getApps().length) {
    try {
      initializeApp(firebaseAdminConfig);
    } catch (error) {
      console.error("Error initializing Firebase Admin:", error);
      throw error;
    }
  }
}
