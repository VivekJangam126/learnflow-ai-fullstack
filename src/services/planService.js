import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export const planService = {
  // Create a new plan
  async createPlan(userId, planData) {
    const planRef = await addDoc(collection(db, 'plans'), {
      userId,
      ...planData,
      createdAt: serverTimestamp(),
      stats: {
        completedTasksCount: 0,
        totalTasksCount: 0,
        totalMinutesPlanned: 0,
        totalMinutesCompleted: 0,
        estimatedCompletionDate: planData.estimatedCompletionDate || null
      }
    });
    return planRef.id;
  },

  // Get all plans for a user
  async getUserPlans(userId) {
    const q = query(
      collection(db, 'plans'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Get a single plan
  async getPlan(planId) {
    const docRef = doc(db, 'plans', planId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  // Update plan
  async updatePlan(planId, updates) {
    const planRef = doc(db, 'plans', planId);
    await updateDoc(planRef, updates);
  },

  // Delete plan
  async deletePlan(planId) {
    await deleteDoc(doc(db, 'plans', planId));
  },

  // Create weeks for a plan
  async createWeeks(planId, weeks) {
    const weekPromises = weeks.map(week => 
      addDoc(collection(db, 'weeks'), {
        planId,
        ...week,
        stats: {
          completedTasksCount: 0,
          totalTasksCount: week.tasks?.length || 0
        }
      })
    );
    return await Promise.all(weekPromises);
  },

  // Get weeks for a plan
  async getWeeks(planId) {
    const q = query(
      collection(db, 'weeks'),
      where('planId', '==', planId),
      orderBy('weekNumber', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Create tasks for a week
  async createTasks(planId, weekId, tasks) {
    const taskPromises = tasks.map(task => 
      addDoc(collection(db, 'tasks'), {
        planId,
        weekId,
        ...task,
        status: 'not_started',
        completedAt: null
      })
    );
    return await Promise.all(taskPromises);
  },

  // Get tasks for a week
  async getTasks(weekId) {
    const q = query(
      collection(db, 'tasks'),
      where('weekId', '==', weekId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Get all tasks for a plan
  async getAllPlanTasks(planId) {
    const q = query(
      collection(db, 'tasks'),
      where('planId', '==', planId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Update task status
  async updateTaskStatus(taskId, status) {
    const taskRef = doc(db, 'tasks', taskId);
    const updates = { status };
    if (status === 'done') {
      updates.completedAt = serverTimestamp();
    }
    await updateDoc(taskRef, updates);
  },

  // Update task
  async updateTask(taskId, updates) {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, updates);
  },

  // Create or update note
  async saveNote(taskId, planId, content) {
    const q = query(
      collection(db, 'notes'),
      where('taskId', '==', taskId)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return await addDoc(collection(db, 'notes'), {
        taskId,
        planId,
        content,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      const noteRef = doc(db, 'notes', snapshot.docs[0].id);
      await updateDoc(noteRef, {
        content,
        updatedAt: serverTimestamp()
      });
      return noteRef;
    }
  },

  // Get note for a task
  async getNote(taskId) {
    const q = query(
      collection(db, 'notes'),
      where('taskId', '==', taskId)
    );
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  }
};
