# LearnFlow AI - Architecture Documentation

## System Overview

LearnFlow AI is a full-stack web application that uses AI to generate personalized learning plans from course syllabi.

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│   React Frontend (Vite)         │
│   - Auth UI                     │
│   - Plan Management             │
│   - Task Tracking               │
│   - AI Chat Interface           │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│   Firebase Services             │
│   ┌───────────────────────────┐ │
│   │  Authentication           │ │
│   └───────────────────────────┘ │
│   ┌───────────────────────────┐ │
│   │  Firestore Database       │ │
│   │  - users                  │ │
│   │  - plans                  │ │
│   │  - weeks                  │ │
│   │  - tasks                  │ │
│   │  - notes                  │ │
│   └───────────────────────────┘ │
│   ┌───────────────────────────┐ │
│   │  Cloud Functions          │ │
│   │  - generatePlan           │ │
│   │  - getTodaySuggestions    │ │
│   │  - chatWithAI             │ │
│   └───────┬───────────────────┘ │
└───────────┼─────────────────────┘
            │
            ▼
    ┌───────────────┐
    │  Gemini API   │
    │  (Google AI)  │
    └───────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App
├── AuthProvider (Context)
│   ├── AuthPage
│   │   ├── LoginForm
│   │   └── SignupForm
│   │
│   ├── DashboardPage
│   │   └── PlanCard (multiple)
│   │
│   ├── CreatePlanPage
│   │   ├── Step 1: Syllabus Input
│   │   ├── Step 2: Settings
│   │   └── Step 3: Review
│   │
│   └── PlanDetailPage
│       ├── WeekSection (multiple)
│       │   └── TaskItem (multiple)
│       ├── AIAssistant
│       └── Modal (for notes)
```

### State Management

**Global State (Context API):**
- `AuthContext`: User authentication state, profile data

**Local State (useState):**
- Component-specific UI state
- Form inputs
- Loading states
- Modal visibility

**Server State (Firestore):**
- Real-time data synchronization
- Plans, weeks, tasks, notes

### Routing

| Route | Component | Access |
|-------|-----------|--------|
| `/` | AuthPage | Public only |
| `/dashboard` | DashboardPage | Private |
| `/create-plan` | CreatePlanPage | Private |
| `/plan/:planId` | PlanDetailPage | Private |

## Backend Architecture

### Firestore Data Model

```
users (collection)
├── {userId} (document)
    ├── name: string
    ├── email: string
    └── prefs: object
        ├── timezone: string
        ├── hoursPerDayDefault: number
        └── preferredDays: array

plans (collection)
├── {planId} (document)
    ├── userId: string
    ├── title: string
    ├── description: string
    ├── totalWeeks: number
    ├── settings: object
    ├── stats: object
    └── createdAt: timestamp

weeks (collection)
├── {weekId} (document)
    ├── planId: string
    ├── weekNumber: number
    ├── theme: string
    ├── targetHours: number
    └── stats: object

tasks (collection)
├── {taskId} (document)
    ├── planId: string
    ├── weekId: string
    ├── title: string
    ├── type: string
    ├── description: string
    ├── estMinutes: number
    ├── resources: array
    ├── status: string
    └── completedAt: timestamp

notes (collection)
├── {noteId} (document)
    ├── taskId: string
    ├── planId: string
    ├── content: string
    ├── createdAt: timestamp
    └── updatedAt: timestamp
```

### Cloud Functions

#### 1. generatePlan
**Purpose:** Convert syllabus text into structured learning plan

**Input:**
```javascript
{
  title: string,
  syllabus: string,
  weeks: number,
  hoursPerWeek: number,
  availableDays: string[],
  intensity: 'low' | 'medium' | 'high',
  handsOnPreference: number (0-100)
}
```

**Output:**
```javascript
{
  success: boolean,
  plan: {
    title: string,
    description: string,
    totalWeeks: number,
    weeks: [
      {
        weekNumber: number,
        theme: string,
        targetHours: number,
        tasks: [
          {
            title: string,
            type: string,
            estMinutes: number,
            description: string,
            resources: [{ label, url }]
          }
        ]
      }
    ]
  }
}
```

**AI Prompt Strategy:**
- Structured JSON output
- Respects user constraints
- Balances theory vs practice
- Includes resource URLs
- Estimates realistic time

#### 2. getTodaySuggestions
**Purpose:** Suggest tasks for current day

**Input:**
```javascript
{
  plan: { title, totalWeeks, settings },
  tasks: [{ title, status, type, estMinutes }]
}
```

**Output:**
```javascript
{
  success: boolean,
  message: string (AI-generated suggestions)
}
```

#### 3. chatWithAI
**Purpose:** Context-aware learning assistant

**Input:**
```javascript
{
  message: string,
  context: {
    plan: object,
    tasks: array
  }
}
```

**Output:**
```javascript
{
  success: boolean,
  message: string (AI response)
}
```

## Security Architecture

### Authentication Flow

```
1. User enters credentials
   ↓
2. Firebase Auth validates
   ↓
3. JWT token issued
   ↓
4. Token stored in browser
   ↓
5. Token sent with each request
   ↓
6. Firestore rules validate token
   ↓
7. Access granted/denied
```

### Firestore Security Rules

**Principle:** User data isolation
- Users can only read/write their own data
- Plans are scoped to userId
- All operations require authentication

**Rule Examples:**
```javascript
// Users can only access their own profile
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}

// Plans are user-scoped
match /plans/{planId} {
  allow read, write: if request.auth != null && 
    resource.data.userId == request.auth.uid;
}
```

### API Security

**Cloud Functions:**
- Callable functions (not HTTP)
- Automatic authentication context
- Input validation
- Error handling

## Performance Optimizations

### Frontend
- **Code Splitting:** React.lazy for routes
- **Memoization:** useMemo for expensive calculations
- **Debouncing:** Input fields, search
- **Lazy Loading:** Images, components

### Backend
- **Firestore Indexes:** Composite indexes for queries
- **Batch Operations:** Multiple writes in one transaction
- **Caching:** Client-side caching of static data
- **Pagination:** Load weeks/tasks incrementally

### AI Integration
- **Streaming:** Consider streaming responses for long plans
- **Caching:** Cache common syllabus patterns
- **Rate Limiting:** Prevent API abuse
- **Fallbacks:** Handle API failures gracefully

## Scalability Considerations

### Current Limits
- Firestore: 1 write/second per document
- Cloud Functions: 1000 concurrent executions
- Gemini API: Rate limits per project

### Scaling Strategy
1. **Horizontal Scaling:** Firebase auto-scales
2. **Caching Layer:** Redis for frequent queries
3. **CDN:** Static assets via Firebase Hosting
4. **Database Sharding:** Partition by userId
5. **Queue System:** Background job processing

## Monitoring & Logging

### Firebase Console
- Authentication metrics
- Firestore usage
- Function invocations
- Error rates

### Logging Strategy
```javascript
// Cloud Functions
console.log('Plan generated:', { planId, userId });
console.error('Error:', error.message);

// Frontend
// Use Firebase Analytics
logEvent('plan_created', { weeks, intensity });
```

## Development Workflow

```
1. Local Development
   npm run dev (frontend)
   firebase emulators:start (backend)

2. Testing
   Manual testing in browser
   Firestore emulator for data

3. Staging
   firebase deploy --only functions:staging
   Test with staging environment

4. Production
   firebase deploy
   Monitor logs and metrics
```

## Technology Choices

### Why React?
- Component reusability
- Large ecosystem
- Easy state management
- Fast development

### Why Firebase?
- No backend code needed
- Real-time updates
- Built-in authentication
- Generous free tier
- Easy deployment

### Why Gemini?
- Powerful language model
- Structured output support
- Good for educational content
- Reasonable pricing

### Why Tailwind?
- Rapid UI development
- Consistent design system
- Small bundle size
- Easy customization

## Future Architecture Improvements

1. **Microservices:** Separate AI service
2. **GraphQL:** Replace REST with GraphQL
3. **WebSockets:** Real-time collaboration
4. **Service Workers:** Offline support
5. **Edge Functions:** Lower latency
6. **Database:** Consider PostgreSQL for complex queries
7. **Search:** Algolia for full-text search
8. **Analytics:** Custom analytics dashboard

---

**Last Updated:** 2024
**Version:** 1.0.0
