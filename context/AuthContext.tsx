import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/utils/firebase';
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';

const db = getFirestore();

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  addFavoriteExercise: (exerciseId: string) => Promise<void>;
  removeFavoriteExercise: (exerciseId: string) => Promise<void>;
  getFavoriteExercises: () => Promise<string[]>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addFavoriteExercise = async (exerciseId: string) => {
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        favorites: arrayUnion(exerciseId),
      });
    }
  };

  const removeFavoriteExercise = async (exerciseId: string) => {
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        favorites: arrayRemove(exerciseId),
      });
    }
  };

  const getFavoriteExercises = async (): Promise<string[]> => {
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().favorites || [];
      }
    }
    return [];
  };

  return (
    <AuthContext.Provider value={{ user, loading, addFavoriteExercise, removeFavoriteExercise, getFavoriteExercises }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
