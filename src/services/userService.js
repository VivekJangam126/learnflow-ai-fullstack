import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export const userService = {
  // Create user profile
  async createUserProfile(userId, userData) {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      prefs: {
        timezone: userData.timezone || 'UTC',
        hoursPerDayDefault: userData.hoursPerDayDefault || 2,
        preferredDays: userData.preferredDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      }
    });
  },

  // Get user profile
  async getUserProfile(userId) {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updates);
  }
};
