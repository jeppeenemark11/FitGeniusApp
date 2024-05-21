import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  updateProfile as firebaseUpdateProfile,
  deleteUser as firebaseDeleteUser
} from 'firebase/auth';
import { auth } from "@/utils/firebase";
import { getFirestore, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

const db = getFirestore();

const workoutObject = {
  timesUsed: 0,
  exercises: [
    {
      type: "kg-reps",
      id: "0216",
      sets: [
        { reps: 0, weight: 0 },
        { reps: 0, weight: 0 },
        { reps: 0, weight: 0 }
      ],
      name: "cable seated shoulder internal rotation"
    },
    {
      name: "cable standing shoulder external rotation",
      id: "0235",
      sets: [
        { weight: 0, reps: 0 },
        { reps: 0, weight: 0 },
        { weight: 0, reps: 0 }
      ],
      type: "kg-reps"
    },
    {
      id: "0025",
      sets: [
        { reps: 0, weight: 0 },
        { weight: 0, reps: 0 },
        { weight: 0, reps: 0 }
      ],
      type: "kg-reps",
      name: "barbell bench press"
    },
    {
      name: "split squats",
      type: "kg-reps",
      id: "2368",
      sets: [
        { weight: 0, reps: 0 },
        { weight: 0, reps: 0 },
        { weight: 0, reps: 0 }
      ]
    },
    {
      type: "time",
      id: "1201",
      name: "dumbbell burpee",
      sets: [
        { time: "0:00" },
        { time: "0:00" },
        { time: "0:00" }
      ]
    }
  ],
  name: "Full Body",
  times: []
};

// Sign in with email and password
export const signInWithEmail = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);

// Sign up with email and password, creating a Firestore document
export const signUpWithEmail = async (email: string, password: string) => {
  const response = await createUserWithEmailAndPassword(auth, email, password);
  const user = response.user;

  // Create Firestore document for the new user
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    favorites: [],
    workouts: [workoutObject],
    total: 0,
    aiLeft: 1,
  });

  return user;
};

// Sign in with Google, conditionally creating a Firestore document
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, new GoogleAuthProvider());
  const user = result.user;
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  // Create document for the new user
  if (!userDoc.exists()) {
  await setDoc(
    doc(db, 'users', user.uid),
    {
      email: user.email,
      favorites: [],
      workouts: [workoutObject],
      total: 0,
    aiLeft: 1,
    },
    { merge: true } 
  );
};

  return user;
};

// Reset the user's password via email
export const resetPasswordWithEmail = (email: string) =>
  sendPasswordResetEmail(auth, email);

// Update the display name and/or email of the current user
export const updateProfile = async (name: string, email: string) => {
  if (auth.currentUser) {
    await firebaseUpdateProfile(auth.currentUser, { displayName: name });
    const userDocRef = doc(db, 'users', auth.currentUser.uid);

    // Update email in Firestore if changed
    await setDoc(userDocRef, { email: auth.currentUser.email }, { merge: true });
  }
};

// Delete the user's account and remove their Firestore document
export const deleteUser = async () => {
  if (auth.currentUser) {
    const userDocRef = doc(db, 'users', auth.currentUser.uid);

    try {
      await deleteDoc(userDocRef); 
      await firebaseDeleteUser(auth.currentUser); 
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};

// Log out the current user
export const logout = () => signOut(auth);
