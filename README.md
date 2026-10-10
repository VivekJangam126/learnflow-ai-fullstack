# LearnFlow AI - Smart Course Planner

A production-quality, AI-powered learning planner that helps students create personalized study plans using Google Gemini AI.

## Features

- 🤖 **AI-Powered Plan Generation** - Paste any syllabus and get a structured week-by-week learning plan
- 📅 **Flexible Scheduling** - Customize weeks, hours, available days, and intensity
- ✅ **Task Tracking** - Mark tasks as complete and track progress
- 📝 **Notes & PoC** - Add notes and proof-of-concept for each task
- 💬 **AI Assistant** - Context-aware chat to help with learning questions
- 📊 **Progress Analytics** - Visual progress bars and completion stats

## Tech Stack

- **Frontend**: React + Vite + JavaScript + Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Cloud Functions)
- **AI**: Google Gemini API
- **Hosting**: Firebase Hosting

## Project Structure

```
learnflow-ai/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   ├── auth/            # Authentication components
│   │   ├── plans/           # Plan-related components
│   │   └── ai/              # AI assistant components
│   ├── contexts/            # React contexts (Auth)
│   ├── services/            # Firebase & API services
│   ├── pages/               # Page components
│   └── App.jsx
├── functions/               # Firebase Cloud Functions
└── firebase.json
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created at https://console.firebase.google.com
- Google Gemini API key from https://makersuite.google.com/app/apikey

### 2. Clone and Install

```bash
cd A_LearnFlow-AI
npm install
cd functions
npm install
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Configure Firebase Functions

Set the Gemini API key for Cloud Functions:

```bash
firebase login
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"
```

Or for local development, create `functions/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
```

### 5. Initialize Firebase

```bash
firebase init
```

Select:
- Firestore
- Functions
- Hosting

Use existing project and select your Firebase project.

### 6. Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 7. Deploy Cloud Functions

```bash
firebase deploy --only functions
```

### 8. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Usage Guide

### Creating Your First Plan

1. **Sign Up/Login** - Create an account or login
2. **Create Plan** - Click "Create New Plan"
3. **Paste Syllabus** - Add your course syllabus or learning topics
4. **Configure Schedule**:
   - Set number of weeks
   - Set hours per week
   - Select available days
   - Choose intensity level
   - Adjust hands-on vs reading preference
5. **Generate with AI** - Let Gemini create your personalized plan
6. **Review & Save** - Review the generated plan and save

### Tracking Progress

- Click on any plan to view details
- Expand weeks to see tasks
- Check off tasks as you complete them
- Add notes or PoC for each task
- Use the AI assistant for help

### AI Assistant Features

- "What should I do today?" - Get task recommendations
- "Summarize this week" - Get weekly overview
- "Help me understand [topic]" - Get explanations
- Custom questions about your learning plan

## Example Syllabus Input

```
Bug Bounty Hunting - 16 Week Program

Week 1-2: Web Fundamentals
- HTTP/HTTPS protocols
- Request/response cycle
- Status codes and headers
- Cookies and sessions

Week 3-4: Reconnaissance
- Subdomain enumeration
- Port scanning
- Technology fingerprinting
- Google dorking

Week 5-6: OWASP Top 10
- Injection attacks
- Broken authentication
- XSS vulnerabilities
- CSRF attacks

[... continue with your syllabus ...]
```

## Firebase Collections Schema

### users
```javascript
{
  id: string,
  name: string,
  email: string,
  prefs: {
    timezone: string,
    hoursPerDayDefault: number,
    preferredDays: string[]
  }
}
```

### plans
```javascript
{
  id: string,
  userId: string,
  title: string,
  description: string,
  totalWeeks: number,
  settings: {
    hoursPerWeek: number,
    availableDays: string[],
    intensity: 'low' | 'medium' | 'high'
  },
  stats: {
    completedTasksCount: number,
    totalTasksCount: number,
    totalMinutesPlanned: number,
    totalMinutesCompleted: number
  },
  createdAt: timestamp
}
```

### weeks
```javascript
{
  id: string,
  planId: string,
  weekNumber: number,
  theme: string,
  targetHours: number,
  stats: {
    completedTasksCount: number,
    totalTasksCount: number
  }
}
```

### tasks
```javascript
{
  id: string,
  planId: string,
  weekId: string,
  title: string,
  type: 'reading' | 'lab' | 'video' | 'notes' | 'review',
  description: string,
  estMinutes: number,
  resources: [{ label: string, url: string }],
  status: 'not_started' | 'in_progress' | 'done',
  completedAt: timestamp
}
```

### notes
```javascript
{
  id: string,
  taskId: string,
  planId: string,
  content: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

### Deploy Everything

```bash
firebase deploy
```

## Troubleshooting

### Functions not working
- Ensure Gemini API key is set: `firebase functions:config:get`
- Check function logs: `firebase functions:log`

### Firestore permission denied
- Verify security rules are deployed
- Check user is authenticated

### Build errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm run build -- --force`

## Future Enhancements

- [ ] Dark mode toggle
- [ ] Calendar integration
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Collaborative plans
- [ ] Export to PDF
- [ ] Spaced repetition reminders
- [ ] Achievement badges

## License

MIT License - feel free to use for your learning journey!

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for learners everywhere
