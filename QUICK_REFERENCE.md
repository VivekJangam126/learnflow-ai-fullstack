# LearnFlow AI - Quick Reference

## 🚀 Commands

```bash
# Development
npm run dev                    # Start dev server (port 3000)
npm run build                  # Build for production
npm run preview                # Preview production build

# Firebase
firebase login                 # Login to Firebase
firebase init                  # Initialize Firebase project
firebase deploy                # Deploy everything
firebase deploy --only hosting # Deploy frontend only
firebase deploy --only functions # Deploy Cloud Functions only
firebase deploy --only firestore:rules # Deploy security rules
firebase functions:log         # View function logs
firebase emulators:start       # Start local emulators

# Functions
cd functions
npm install                    # Install function dependencies
npm run serve                  # Run functions locally
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main app with routing |
| `src/contexts/AuthContext.jsx` | Authentication state |
| `src/services/planService.js` | Firestore operations |
| `src/services/aiService.js` | AI function calls |
| `functions/index.js` | Cloud Functions (AI) |
| `firestore.rules` | Security rules |
| `.env` | Frontend environment variables |
| `functions/.env` | Backend environment variables |

## 🔑 Environment Variables

### Frontend (.env)
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Backend (functions/.env)
```env
GEMINI_API_KEY=
```

## 🎨 Component Library

### Common Components
```jsx
import { Button } from './components/common/Button';
import { Card } from './components/common/Card';
import { Input } from './components/common/Input';
import { Modal } from './components/common/Modal';
import { ProgressBar } from './components/common/ProgressBar';

// Usage
<Button variant="primary" loading={false}>Click Me</Button>
<Card hover onClick={handleClick}>Content</Card>
<Input label="Email" type="email" value={email} onChange={setEmail} />
<Modal isOpen={true} onClose={close} title="Title">Content</Modal>
<ProgressBar progress={75} showLabel={true} />
```

### Button Variants
- `primary` - Blue background
- `secondary` - Gray background
- `success` - Green background
- `outline` - Border only

### Button Sizes
- `sm` - Small
- `md` - Medium (default)
- `lg` - Large

## 🔥 Firebase Services

### Authentication
```javascript
import { useAuth } from './contexts/AuthContext';

const { user, login, signup, logout } = useAuth();

await signup(email, password, { name, timezone });
await login(email, password);
await logout();
```

### Firestore Operations
```javascript
import { planService } from './services/planService';

// Plans
const planId = await planService.createPlan(userId, planData);
const plans = await planService.getUserPlans(userId);
const plan = await planService.getPlan(planId);
await planService.updatePlan(planId, updates);

// Weeks
await planService.createWeeks(planId, weeksArray);
const weeks = await planService.getWeeks(planId);

// Tasks
await planService.createTasks(planId, weekId, tasksArray);
const tasks = await planService.getTasks(weekId);
await planService.updateTaskStatus(taskId, 'done');

// Notes
await planService.saveNote(taskId, planId, content);
const note = await planService.getNote(taskId);
```

### AI Functions
```javascript
import { aiService } from './services/aiService';

// Generate plan
const result = await aiService.generatePlan({
  title, syllabus, weeks, hoursPerWeek,
  availableDays, intensity, handsOnPreference
});

// Get suggestions
const suggestions = await aiService.getTodaySuggestions({
  plan, tasks
});

// Chat
const response = await aiService.chatWithAI(message, context);
```

## 🎯 Common Tasks

### Add a New Page
1. Create `src/pages/NewPage.jsx`
2. Add route in `src/App.jsx`
3. Add navigation link

### Add a New Component
1. Create in appropriate folder
2. Export from component file
3. Import where needed

### Modify AI Prompt
1. Edit `functions/index.js`
2. Update prompt text
3. Deploy: `firebase deploy --only functions`

### Change Colors
1. Edit `tailwind.config.js`
2. Update color values
3. Restart dev server

### Add Firestore Collection
1. Create service methods
2. Add security rules in `firestore.rules`
3. Add indexes if needed in `firestore.indexes.json`
4. Deploy: `firebase deploy --only firestore`

## 🐛 Debugging

### Frontend Issues
```bash
# Check console in browser DevTools
# Verify .env file exists and has correct values
# Check network tab for failed requests
# Clear browser cache and reload
```

### Backend Issues
```bash
# View function logs
firebase functions:log

# Check Firestore rules
firebase deploy --only firestore:rules

# Verify API keys
firebase functions:config:get
```

### Common Errors

**"Firebase not configured"**
- Check `.env` file exists
- Verify all VITE_ variables are set
- Restart dev server

**"Permission denied"**
- Deploy Firestore rules
- Check user is authenticated
- Verify userId matches

**"Functions not working"**
- Check Gemini API key is set
- View function logs
- Ensure functions are deployed

## 📊 Data Structure Quick Reference

### Plan Object
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

### Task Object
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

## 🎨 Tailwind Utilities

### Custom Classes
```css
.btn-primary      /* Primary button */
.btn-secondary    /* Secondary button */
.card             /* Card container */
.input-field      /* Input field */
```

### Common Patterns
```jsx
// Flex center
<div className="flex items-center justify-center">

// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Responsive padding
<div className="px-4 md:px-6 lg:px-8">

// Hover effect
<div className="hover:bg-gray-100 transition-colors">

// Animation
<div className="animate-fade-in">
```

## 🔗 Useful Links

- **Firebase Console**: https://console.firebase.google.com
- **Gemini API**: https://makersuite.google.com/app/apikey
- **Tailwind Docs**: https://tailwindcss.com/docs
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev

## 📞 Support

- Check README.md for overview
- See SETUP_GUIDE.md for detailed setup
- Review ARCHITECTURE.md for technical details
- Open GitHub issue for bugs

---

**Quick Start:** `npm install && npm run dev` 🚀
