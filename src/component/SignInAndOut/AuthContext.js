import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  const saveProgress = async (progressData) => {
    if (!user) {
      console.error("No authenticated user");
      return;
    }

    try {
      const completeProgressData = {
        currentDay: progressData.currentDay ?? 0,
        lastCompletionDate: progressData.lastCompletionDate ?? '',
        completedDays: progressData.completedDays ?? [],
        cycleCount: progressData.cycleCount ?? 0,
        entries: progressData.entries ?? [],
        completedChallenges: progressData.completedChallenges ?? [],
        dailyEntries: progressData.dailyEntries ?? []
      };

      const userDocRef = doc(db, "users", user.uid);

      await setDoc(userDocRef, {
        progress: completeProgressData,
        lastUpdated: serverTimestamp()
      }, { merge: true });

      setUserProgress(completeProgressData);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const fetchProgress = async (uid) => {
    if (!uid) return null;
  
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        console.log('User progress found:', docSnap.data().progress);
        return docSnap.data().progress || null;
      } else {
        console.warn('No progress data found for UID:', uid);
        return null;
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      return null;
    }
  };  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setLoading(true);
        if (currentUser) {
          setUser(currentUser);
          const progress = await fetchProgress(currentUser.uid);
          setUserProgress(progress);
        } else {
          setUser(null);
          setUserProgress(null);
        }
      } catch (error) {
        console.error("Error in onAuthStateChanged:", error);
      } finally {
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, []);  
  
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;
      
      localStorage.clear();
      sessionStorage.clear();
      setUserProgress(null);
  
      const progress = await fetchProgress(loggedInUser.uid);
      if (progress) {
        setUserProgress(progress);
      }
  
      return { 
        success: true, 
        user: loggedInUser,
        progress: progress 
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  };  
  
  const logout = async () => {
    try {
      if (user && userProgress) {
        console.log('Saving progress:', userProgress);
        await saveProgress(userProgress);
      }
      localStorage.clear();
      sessionStorage.clear();
      
      await signOut(auth);
      setUser(null);
      setUserProgress(null);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };  

  const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Optional: Create a user document in Firestore
      await setDoc(doc(db, "users", newUser.uid), {
        email: newUser.email,
        createdAt: serverTimestamp(),
      })
        .then(() => console.log('User data saved successfully'))
        .catch((error) => console.error('Error saving user data:', error));      

      return { 
        success: true, 
        message: "Sign-up successful!", 
        user: newUser 
      };
    } catch (error) {
      let errorMessage = error.message;
  
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use. Please sign in instead.';
      }
  
      return { success: false, message: errorMessage };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProgress, 
      login, 
      logout, 
      signUp, 
      saveProgress,
      loading,
      isAuthenticated 
    }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);