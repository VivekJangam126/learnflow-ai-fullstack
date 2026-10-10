# LearnFlow AI - Complete Setup Guide

## Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
cd functions && npm install && cd ..
```

### Step 2: Configure Firebase
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Get your Firebase config from Project Settings

### Step 3: Set Environment Variables
Create `.env` in root:
```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc
```

Create `functions/.env`:
```env
GEMINI_API_KEY=your_gemini_key_from_makersuite
```

### Step 4: Deploy Firebase
```bash
firebase login
firebase init  # Select Firestore, Functions, Hosting
firebase deploy --only firestore:rules,firestore:indexes
firebase deploy --only functions
```

### Step 5: Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

---

## Detailed Setup

### Firebase Configuration

#### 1. Enable Authentication
- Go to Firebase Console → Authentication
- Click "Get Started"
- Enable "Email/Password" provider

#### 2. Create Firestore Database
- Go to Firestore Database
- Click "Create Database"
- Start in **production mode**
- Choose your region

#### 3. Get Gemini API Key
- Visit https://makersuite.google.com/app/apikey
- Create new API key
- Copy the key for Cloud Functions

### Cloud Functions Setup

#### Local Development
```bash
cd functions
npm install
```

Set environment variable:
```bash
# For local testing
echo "GEMINI_API_KEY=your_key" > .env

# For production
firebase functions:config:set gemini.api_key="your_key"
```

#### Deploy Functions
```bash
firebase deploy --only functions
```

Verify deployment:
```bash
firebase functions:log
```

### Firestore Security Rules

The `firestore.rules` file ensures:
- Users can only access their own data
- Authentication is required for all operations
- Plans are user-scoped

### Firestore Indexes

Required composite indexes are in `firestore.indexes.json`:
- Plans by userId + createdAt
- Weeks by planId + weekNumber
- Tasks by weekId and planId

Deploy indexes:
```bash
firebase deploy --only firestore:indexes
```

---

## Testing the Application

### 1. Create Account
- Visit http://localhost:3000
- Click "Sign up"
- Enter name, email, password

### 2. Create First Plan
- Click "Create New Plan"
- Paste the example syllabus from `EXAMPLE_SYLLABUS.md`
- Set:
  - Title: "16-Week Bug Bounty Roadmap"
  - Weeks: 16
  - Hours/week: 10
  - Days: Mon-Fri
  - Intensity: Medium
  - Hands-on: 60%
- Click "Generate Plan with AI"
- Review and save

### 3. Track Progress
- Click on your plan
- Expand weeks
- Check off completed tasks
- Add notes to tasks
- Use AI assistant

---

## Troubleshooting

### "Firebase not configured"
- Check `.env` file exists in root
- Verify all VITE_ variables are set
- Restart dev server: `npm run dev`

### "Functions not working"
- Check Gemini API key: `firebase functions:config:get`
- View logs: `firebase functions:log`
- Ensure functions are deployed: `firebase deploy --only functions`

### "Permission denied" in Firestore
- Deploy rules: `firebase deploy --only firestore:rules`
- Check user is authenticated
- Verify userId matches in plans collection

### "Build errors"
```bash
rm -rf node_modules
npm install
npm run build
```

### "CORS errors with Functions"
- Ensure you're using Firebase SDK v10+
- Functions must be deployed (not just emulated)
- Check Firebase project ID matches

---

## Production Deployment

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

Your app will be live at: `https://your-project-id.web.app`

---

## Environment Variables Reference

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| VITE_FIREBASE_API_KEY | Firebase API key | AIza... |
| VITE_FIREBASE_AUTH_DOMAIN | Auth domain | app.firebaseapp.com |
| VITE_FIREBASE_PROJECT_ID | Project ID | my-project |
| VITE_FIREBASE_STORAGE_BUCKET | Storage bucket | app.appspot.com |
| VITE_FIREBASE_MESSAGING_SENDER_ID | Sender ID | 123456 |
| VITE_FIREBASE_APP_ID | App ID | 1:123:web:abc |

### Backend (functions/.env)
| Variable | Description | Example |
|----------|-------------|---------|
| GEMINI_API_KEY | Google Gemini API key | AIza... |

---

## Next Steps

1. **Customize the UI**: Edit Tailwind colors in `tailwind.config.js`
2. **Add Features**: Extend Cloud Functions for more AI capabilities
3. **Improve Prompts**: Refine Gemini prompts in `functions/index.js`
4. **Add Analytics**: Integrate Firebase Analytics
5. **Mobile App**: Consider React Native version

---

## Support

- Check README.md for usage guide
- Review EXAMPLE_SYLLABUS.md for syllabus format
- Open GitHub issues for bugs
- Join our community (coming soon)

Happy Learning! 🚀
