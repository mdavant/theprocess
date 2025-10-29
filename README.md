
# TheProcess - Fitness & Nutrition Tracker

Welcome to TheProcess, a comprehensive, mobile-first web application designed for tracking bodybuilding and nutrition progress. This application is built with React, TypeScript, and Tailwind CSS, and is designed to be fully functional, exportable, and hostable.

## ✨ Features

-   **Workout Tracking**: Log your training sessions, exercises, sets, reps, and weights. View your history and personal records (PRs).
-   **Live Workout Mode**: An active session page with a timer that persists in `localStorage` so you never lose your progress.
-   **Nutrition Diary**: Track your daily caloric and macronutrient intake (protein, carbs, fat).
-   **Macro Calculator**: Calculate your daily needs based on the Mifflin-St Jeor formula and your personal goals.
-   **Organization Hub**: Plan your day with a schedule and manage your tasks with a to-do list.
-   **Progress Visualization**: See your progress through responsive charts, measurement tracking, and a photo timeline.
-   **Social Features**: Public profiles, follow system, and a main feed to see activity from people you follow.
-   **PWA Ready**: Installable on mobile devices for a native-like experience.

## ⚙️ Tech Stack

-   **Framework**: React 18+
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Routing**: React Router (`HashRouter`)
-   **Icons**: Lucide React
-   **Charts**: Recharts
-   **Data Persistence**: `localStorage` for active sessions, with hooks prepared for a backend.
-   **Backend (Recommended)**: Supabase

---

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm, yarn, or pnpm

### Installation

1.  **Clone the repository (or download the source code):**
    ```bash
    git clone <repository_url>
    cd TheProcess
    ```

2.  **Install dependencies:**
    This project uses several libraries. Make sure to install them.

    ```bash
    npm install react react-dom react-router-dom recharts lucide-react framer-motion
    npm install --save-dev @types/react @types/react-dom typescript
    ```

3.  **Environment Variables:**
    The application is designed to work with a backend like Supabase. You'll need to configure your environment variables. Create a `.env` file in the root of the project:

    ```
    # TODO: Add your Supabase project URL and anon key
    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

    # TODO: Add your Stripe public key for payments
    VITE_STRIPE_PUBLIC_KEY=YOUR_STRIPE_PUBLIC_KEY
    ```
    *Note: This project uses mock data by default, so it will run without these keys. To connect to a real backend, you'll need to replace the mock functions in `src/services/api.ts` with your Supabase client calls.*

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) (or the port specified) to view it in the browser.

### Build for Production

To create a production-ready build of the app:
```bash
npm run build
```
This will create a `dist` folder with all the static assets, ready to be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

---

## 🔧 Configuration

### 1. Supabase Backend Setup

This app is pre-configured to work seamlessly with [Supabase](https://supabase.com/).

1.  **Create a Supabase Project**: Go to the Supabase dashboard and create a new project.
2.  **Database Schema**: Use the SQL editor in Supabase to run the schema based on the types defined in `src/types.ts`. Here are some example tables to get you started:

    ```sql
    -- Users table is handled by Supabase Auth
    -- You can add a `profiles` table linked to `auth.users`

    CREATE TABLE workouts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id),
      name TEXT NOT NULL,
      date TIMESTAMPTZ NOT NULL,
      duration_minutes INT,
      volume_kg NUMERIC,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    );
    -- ... create other tables for exercises, nutrition_entries, etc.
    ```

3.  **Update API Client**: In `src/services/api.ts`, comment out or replace the mock data functions with actual Supabase client calls. You'll need to install the `@supabase/supabase-js` package.

### 2. Monetization (Stripe / AdMob)

The app includes placeholders for monetization.

-   **Stripe**: To enable premium features, you'll need a Stripe account.
    1.  Get your **Public Key** from the Stripe dashboard.
    2.  Add it to your `.env` file as `VITE_STRIPE_PUBLIC_KEY`.
    3.  Implement the payment flow logic in `src/pages/SettingsPage.tsx` where the placeholder is located.

-   **AdMob**: If you convert the app to a native mobile app (see below), you can integrate AdMob.
    1.  The placements for ads are marked with `// TODO: AdMob integration point` comments.
    2.  You'll use a Capacitor plugin for AdMob to display ads.

---

## 📱 Turn into a Native App (APK/IPA) with Capacitor

You can easily convert this web app into a native iOS or Android app using [Capacitor](https://capacitorjs.com/).

1.  **Install Capacitor CLI:**
    ```bash
    npm install @capacitor/cli @capacitor/core
    ```

2.  **Initialize Capacitor:**
    ```bash
    npx cap init TheProcess com.theprocess.app --web-dir=dist
    ```
    This will configure Capacitor for your project, pointing to the `dist` build directory.

3.  **Add Native Platforms:**
    ```bash
    # For Android
    npm install @capacitor/android
    npx cap add android

    # For iOS
    npm install @capacitor/ios
    npx cap add ios
    ```

4.  **Build and Sync:**
    First, build your React app.
    ```bash
    npm run build
    ```
    Then, sync the web assets with your native projects.
    ```bash
    npx cap sync
    ```

5.  **Open and Build in Native IDE:**
    ```bash
    # Open in Android Studio
    npx cap open android

    # Open in Xcode
    npx cap open ios
    ```
    From the native IDE, you can build, run on an emulator, or generate a signed APK/IPA for app stores.

---

## ✅ Testing

While this project does not include a test suite, here is a recommended testing strategy:

-   **Unit Tests (Jest/Vitest)**:
    -   Test utility functions like the macro calculator in `src/utils/macros.ts`.
    -   Test custom hooks logic, such as `useActiveWorkout`.
-   **Component Tests (React Testing Library)**:
    -   Render individual components and assert that they display correctly based on props.
    -   Simulate user interactions (clicks, input changes) and verify the outcome.
-   **End-to-End Tests (Cypress/Playwright)**:
    -   Simulate full user flows, such as signing up, starting a workout, adding sets, saving it, and then viewing it in the history.
    -   Test the nutrition logging flow.
