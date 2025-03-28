import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  const safeParseJSON = (key, defaultValue = []) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error parsing ${key}:`, error);
      return defaultValue;
    }
  };

  const saveProgress = async (progressData) => {
    // Ensure we have a valid user
    if (!user) {
      console.warn("No authenticated user. Saving to local storage only.");
      
      // Save to local storage
      Object.keys(progressData).forEach(key => {
        if (['entries', 'completedChallenges', 'dailyEntries', 'completedDays'].includes(key)) {
          localStorage.setItem(key, JSON.stringify(progressData[key] || []));
        } else if (['currentDay', 'cycleCount'].includes(key)) {
          localStorage.setItem(key, (progressData[key] || 0).toString());
        } else if (key === 'lastCompletionDate') {
          localStorage.setItem(key, progressData[key] || '');
        }
      });
      
      return;
    }
  
    try {
      // Prepare complete progress data with fallback values and flatten complex objects
      const completeProgressData = {
        'progress.currentDay': progressData.currentDay ?? 0,
        'progress.lastCompletionDate': progressData.lastCompletionDate ?? '',
        'progress.completedDays': progressData.completedDays ? JSON.stringify(progressData.completedDays) : '[]',
        'progress.cycleCount': progressData.cycleCount ?? 0,
        'progress.entries': progressData.entries ? JSON.stringify(progressData.entries) : '[]',
        'progress.completedChallenges': progressData.completedChallenges ? JSON.stringify(progressData.completedChallenges) : '[]',
        'progress.dailyEntries': progressData.dailyEntries ? JSON.stringify(progressData.dailyEntries) : '[]',
        lastUpdated: serverTimestamp()
      };
  
      const userDocRef = doc(db, "users", user.uid);
  
      // Update document using dot notation for nested fields
      await updateDoc(userDocRef, completeProgressData);
  
      // Update local storage
      Object.keys(progressData).forEach(key => {
        if (['entries', 'completedChallenges', 'dailyEntries', 'completedDays'].includes(key)) {
          localStorage.setItem(key, JSON.stringify(progressData[key] || []));
        } else if (['currentDay', 'cycleCount'].includes(key)) {
          localStorage.setItem(key, (progressData[key] || 0).toString());
        } else if (key === 'lastCompletionDate') {
          localStorage.setItem(key, progressData[key] || '');
        }
      });
  
      // Fetch the updated document to ensure local state is correct
      const updatedDoc = await getDoc(userDocRef);
      const updatedProgressData = updatedDoc.data().progress;
  
      // Parse stringified arrays back to their original form
      const parsedProgressData = {
        currentDay: updatedProgressData.currentDay,
        lastCompletionDate: updatedProgressData.lastCompletionDate,
        completedDays: JSON.parse(updatedProgressData.completedDays),
        cycleCount: updatedProgressData.cycleCount,
        entries: JSON.parse(updatedProgressData.entries),
        completedChallenges: JSON.parse(updatedProgressData.completedChallenges),
        dailyEntries: JSON.parse(updatedProgressData.dailyEntries)
      };
  
      // Update local state
      setUserProgress(parsedProgressData);
  
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const fetchProgress = useCallback(async (uid) => {
    if (!uid) return null;
  
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
  
      // Retrieve existing local storage data
      const localProgressData = {
        currentDay: parseInt(localStorage.getItem('currentDay') || '0'),
        lastCompletionDate: localStorage.getItem('lastCompletionDate') || '',
        completedDays: safeParseJSON('completedDays'),
        cycleCount: parseInt(localStorage.getItem('cycleCount') || '0'),
        entries: safeParseJSON('entries'),
        completedChallenges: safeParseJSON('completedChallenges'),
        dailyEntries: safeParseJSON('dailyEntries')
      };
  
      if (docSnap.exists() && docSnap.data().progress) {
        const fetchedProgressData = docSnap.data().progress;
        
        // Parse stringified arrays
        const parsedFetchedData = {
          currentDay: fetchedProgressData.currentDay ?? localProgressData.currentDay,
          lastCompletionDate: fetchedProgressData.lastCompletionDate || localProgressData.lastCompletionDate,
          completedDays: fetchedProgressData.completedDays 
            ? JSON.parse(fetchedProgressData.completedDays)
            : localProgressData.completedDays,
          cycleCount: fetchedProgressData.cycleCount ?? localProgressData.cycleCount,
          entries: fetchedProgressData.entries 
            ? JSON.parse(fetchedProgressData.entries)
            : localProgressData.entries,
          completedChallenges: fetchedProgressData.completedChallenges
            ? JSON.parse(fetchedProgressData.completedChallenges)
            : localProgressData.completedChallenges,
          dailyEntries: fetchedProgressData.dailyEntries
            ? JSON.parse(fetchedProgressData.dailyEntries)
            : localProgressData.dailyEntries
        };
  
        // Merge strategy
        const mergedProgressData = {
          ...localProgressData,
          ...parsedFetchedData
        };
  
        // Immediately update local storage with merged data
        Object.keys(mergedProgressData).forEach(key => {
          if (['entries', 'completedChallenges', 'dailyEntries', 'completedDays'].includes(key)) {
            localStorage.setItem(key, JSON.stringify(mergedProgressData[key]));
          } else if (['currentDay', 'cycleCount'].includes(key)) {
            localStorage.setItem(key, mergedProgressData[key].toString());
          } else if (key === 'lastCompletionDate') {
            localStorage.setItem(key, mergedProgressData[key]);
          }
        });
  
        return mergedProgressData;
      } else {
        return localProgressData;
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      return null;
    }
  }, []);
  
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
          
          // Clear local storage when logged out
          localStorage.removeItem('currentDay');
          localStorage.removeItem('lastCompletionDate');
          localStorage.removeItem('completedDays');
          localStorage.removeItem('cycleCount');
          localStorage.removeItem('entries');
          localStorage.removeItem('completedChallenges');
          localStorage.removeItem('dailyEntries');
        }
      } catch (error) {
        console.error("Error in onAuthStateChanged:", error);
      } finally {
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, [fetchProgress]); // Added fetchProgress to dependency array
  
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;
  
      // Fetch progress and use merged data strategy
      const progress = await fetchProgress(loggedInUser.uid);
      
      if (progress) {
        // Update local storage with fetched progress
        Object.keys(progress).forEach(key => {
          if (['entries', 'completedChallenges', 'dailyEntries', 'completedDays'].includes(key)) {
            localStorage.setItem(key, JSON.stringify(progress[key]));
          } else if (['currentDay', 'cycleCount'].includes(key)) {
            localStorage.setItem(key, progress[key].toString());
          } else if (key === 'lastCompletionDate') {
            localStorage.setItem(key, progress[key]);
          }
        });
  
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
  
  const signUp = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
  
      // Initial progress data with default values
      const initialProgressData = {
        currentDay: 0,
        lastCompletionDate: '',
        completedDays: [],
        cycleCount: 0,
        entries: [],
        completedChallenges: [],
        dailyEntries: []
      };
  
      const userDocRef = doc(db, "users", newUser.uid);
      await setDoc(userDocRef, {
        name: name, // Add name field
        email: email,
        progress: initialProgressData,
        createdAt: serverTimestamp()
      });
  
      setUser(newUser);
      setUserProgress(initialProgressData);
  
      return { 
        success: true, 
        user: newUser,
        progress: initialProgressData 
      };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: error.message };
    }
  };
  
  const logout = async () => {
    try {
      // Retrieve current progress from local storage before logging out
      const currentProgressData = {
        currentDay: parseInt(localStorage.getItem('currentDay') || '0'),
        lastCompletionDate: localStorage.getItem('lastCompletionDate') || '',
        completedDays: JSON.parse(localStorage.getItem('completedDays') || '[]'),
        cycleCount: parseInt(localStorage.getItem('cycleCount') || '0'),
        entries: JSON.parse(localStorage.getItem('entries') || '[]'),
        completedChallenges: JSON.parse(localStorage.getItem('completedChallenges') || '[]'),
        dailyEntries: JSON.parse(localStorage.getItem('dailyEntries') || '[]')
      };
  
      // If user exists, save progress
      if (user) {
        await saveProgress(currentProgressData);
      }
      
      await signOut(auth);
      setUser(null);
      setUserProgress(null);
    } catch (error) {
      console.error('Logout error:', error);
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