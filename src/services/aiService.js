import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

export const aiService = {
  // Generate plan from syllabus
  async generatePlan(syllabusData) {
    const generatePlanFunction = httpsCallable(functions, 'generatePlan');
    const result = await generatePlanFunction(syllabusData);
    return result.data;
  },

  // Get AI suggestions for today
  async getTodaySuggestions(planData) {
    const getSuggestionsFunction = httpsCallable(functions, 'getTodaySuggestions');
    const result = await getSuggestionsFunction(planData);
    return result.data;
  },

  // Chat with AI assistant
  async chatWithAI(message, context) {
    const chatFunction = httpsCallable(functions, 'chatWithAI');
    const result = await chatFunction({ message, context });
    return result.data;
  }
};
