export interface AuthState {
  isSignedIn: boolean;
  isLoading: boolean;
  userId: string | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
}

export interface VerificationCode {
  code: string;
}
