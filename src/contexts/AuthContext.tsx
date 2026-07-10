import { ReactNode, createContext, useEffect, useState } from "react";
import { 
  User, onAuthStateChanged, signInWithPopup, 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, updateProfile, sendEmailVerification
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (e: string, p: string) => Promise<void>;
  signUpWithEmail: (n: string, e: string, p: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
    navigate("/dashboard");
  };

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
    navigate("/dashboard");
  };

  const signUpWithEmail = async (name: string, email: string, pass: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(res.user, { displayName: name });
    
    // Trigger verification email send
    try {
      await sendEmailVerification(res.user);
    } catch (e) {
      console.error("Verification email sending failed: ", e);
    }

    setCurrentUser(auth.currentUser);
    navigate("/dashboard", { state: { newUser: true } });
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
