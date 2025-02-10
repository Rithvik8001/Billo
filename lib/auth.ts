import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "./firebase";

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    const userCredential = await signInWithPopup(auth, provider);
    const token = await userCredential.user.getIdToken();
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return {
      user: null,
      error: error.message || "Failed to sign in with Google",
    };
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = await userCredential.user.getIdToken();
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return {
      user: null,
      error: error.message || "Failed to sign in",
    };
  }
}

export async function signUpWithEmail(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = await userCredential.user.getIdToken();
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return {
      user: null,
      error: error.message || "Failed to sign up",
    };
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return {
      error: error.message || "Failed to sign out",
    };
  }
}
