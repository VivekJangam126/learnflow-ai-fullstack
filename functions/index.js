import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate a learning plan from syllabus
 */
export const generatePlan = onCall(async (request) => {
  const { title, syllabus, weeks, hoursPerWeek, availableDays, intensity, handsOnPreference } = request.data;

  if (!syllabus || !weeks || !hoursPerWeek) {
    throw new HttpsError('invalid-argument', 'Missing required fields');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an expert learning planner. Create a detailed ${weeks}-week learning plan based on the following syllabus.

SYLLABUS:
${syllabus}

CONSTRAINTS:
- Total weeks: ${weeks}
- Hours per week: ${hoursPerWeek}
- Available days: ${availableDays.join(', ')}
- Intensity: ${intensity}
- Hands-on preference: ${handsOnPreference}% (vs reading/theory)

REQUIREMENTS:
1. Break down the syllabus into ${weeks} weekly themes
2. Each week should have 4-8 tasks
3. Tasks should be a mix of:
   - reading (theory, documentation)
   - lab (hands-on practice, exercises)
   - video (tutorials, courses)
   - notes (summarization, reflection)
   - review (testing knowledge)
4. Estimate time in minutes for each task
5. Respect prerequisites - teach basics before advanced topics
6. Balance hands-on vs reading based on preference
7. Include specific resources (URLs) where possible

OUTPUT FORMAT (JSON only, no markdown):
{
  "title": "${title}",
  "description": "Brief 1-sentence description",
  "totalWeeks": ${weeks},
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "Week theme/focus",
      "targetHours": ${hoursPerWeek},
      "tasks": [
        {
          "title": "Task title",
          "type": "reading|lab|video|notes|review",
          "estMinutes": 90,
          "description": "What to do",
          "resources": [
            {"label": "Resource name", "url": "https://..."}
          ]
        }
      ]
    }
  ]
}

Generate the plan now:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response (remove markdown code blocks if present)
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    const plan = JSON.parse(jsonText);

    return { success: true, plan };
  } catch (error) {
    console.error('Error generating plan:', error);
    throw new HttpsError('internal', 'Failed to generate plan: ' + error.message);
  }
});

/**
 * Get AI suggestions for today's tasks
 */
export const getTodaySuggestions = onCall(async (request) => {
  const { plan, tasks } = request.data;

  if (!plan || !tasks) {
    throw new HttpsError('invalid-argument', 'Missing plan or tasks data');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const incompleteTasks = tasks.filter(t => t.status !== 'done');
    const prompt = `Based on this learning plan, suggest 2-3 tasks the user should focus on today.

PLAN: ${plan.title}
AVAILABLE TIME: Assume 2 hours today
INCOMPLETE TASKS:
${incompleteTasks.slice(0, 10).map(t => `- ${t.title} (${t.estMinutes}m, type: ${t.type})`).join('\n')}

Provide a brief, encouraging response with specific task recommendations. Keep it under 100 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const message = response.text();

    return { success: true, message };
  } catch (error) {
    console.error('Error getting suggestions:', error);
    throw new HttpsError('internal', 'Failed to get suggestions: ' + error.message);
  }
});

/**
 * Chat with AI assistant
 */
export const chatWithAI = onCall(async (request) => {
  const { message, context } = request.data;

  if (!message) {
    throw new HttpsError('invalid-argument', 'Message is required');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const contextStr = context ? `
LEARNING PLAN CONTEXT:
- Plan: ${context.plan?.title || 'N/A'}
- Total weeks: ${context.plan?.totalWeeks || 'N/A'}
- Hours/week: ${context.plan?.settings?.hoursPerWeek || 'N/A'}

TASKS SUMMARY:
${context.tasks?.slice(0, 5).map(t => `- ${t.title} (${t.status})`).join('\n') || 'No tasks'}
` : '';

    const prompt = `You are a helpful learning assistant for LearnFlow AI, a course planning app.
${contextStr}

USER QUESTION: ${message}

Provide a helpful, concise response (under 150 words). Be encouraging and actionable.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiMessage = response.text();

    return { success: true, message: aiMessage };
  } catch (error) {
    console.error('Error in chat:', error);
    throw new HttpsError('internal', 'Failed to process chat: ' + error.message);
  }
});
