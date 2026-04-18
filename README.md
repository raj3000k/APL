# FanPulse IPL

FanPulse IPL is a premium full-stack React web app for IPL fans to post match moments, react live, chat in realtime, discover nearby same-team fans, and create watch parties.

The repo is built with:

- React + Vite + TypeScript
- Tailwind CSS
- shadcn-style UI primitives
- Framer Motion
- Supabase-ready auth/data services
- React Query
- Geolocation API
- Lottie

## What is implemented

- Google sign-in through Supabase Auth when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are present
- Demo auth/data fallback so the app still runs before Supabase is wired
- Onboarding with username, avatar URL, and single-team selection
- Dynamic team theming, slogans, gradients, and accent styling
- Social feed with post composer, likes, comments, share actions, badges, and motion
- Sticky live-match banner with emotion-room reactions
- Realtime-ready chat UI for team, match, emotion, connection, and watch-party rooms
- Nearby fans discovery with geolocation and same-team radius filtering
- Connections and watch-party flows
- Profile and lightweight leaderboard/prediction surfaces
- Cloud Run deployment assets

## Local setup

1. Install dependencies:

```bash
yarn install
```

2. Copy envs:

```bash
cp .env.example .env.local
```

3. Add your Supabase values to `.env.local`.

4. Run the app:

```bash
yarn dev
```

5. Build for production:

```bash
yarn build
```

## Supabase setup

1. Create a Supabase project.
2. In Supabase Auth, enable Google as an OAuth provider.
3. Add these redirect URLs:
   - `http://localhost:5173`
   - your production Cloud Run URL
4. Run the SQL in [supabase/schema.sql](/Users/rajmotwani/Documents/APL/supabase/schema.sql:1).
5. Create storage buckets such as:
   - `avatars`
   - `post-media`

## Notes about the current data layer

The frontend already uses a `socialService` adapter at [src/services/supabase/social-service.ts](/Users/rajmotwani/Documents/APL/src/services/supabase/social-service.ts:1). Right now it persists into local storage so you can preview the whole experience immediately. That adapter is intentionally shaped so you can swap local operations for live Supabase table queries, RPC calls, and Realtime subscriptions without reworking the UI.

## Deploy to GCP Cloud Run

### Option 1: direct Docker build

```bash
gcloud builds submit \
  --tag us-central1-docker.pkg.dev/PROJECT_ID/fanpulse/fanpulse-ipl \
  --substitutions=_VITE_SUPABASE_URL=https://your-project-ref.supabase.co,_VITE_SUPABASE_ANON_KEY=your-anon-key
```

```bash
gcloud run deploy fanpulse-ipl \
  --image us-central1-docker.pkg.dev/PROJECT_ID/fanpulse/fanpulse-ipl \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Option 2: Cloud Build config in this repo

```bash
gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions=_IMAGE=us-central1-docker.pkg.dev/PROJECT_ID/fanpulse/fanpulse-ipl,_VITE_SUPABASE_URL=https://your-project-ref.supabase.co,_VITE_SUPABASE_ANON_KEY=your-anon-key
```

Then deploy the built image to Cloud Run:

```bash
gcloud run deploy fanpulse-ipl \
  --image us-central1-docker.pkg.dev/PROJECT_ID/fanpulse/fanpulse-ipl \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Important follow-up if you want fully live backend behavior

These UI flows are already present, but for full production data you should wire them from local storage into Supabase:

- feed CRUD to `posts`, `post_likes`, and `comments`
- chat rooms and `messages` over Supabase Realtime channels
- nearby fans using the `nearby_team_fans` SQL function
- notifications from database triggers or Edge Functions
- avatar/media uploads through Supabase Storage

## Project structure

```text
src/
  animations/
  auth/
  chat/
  components/
  feed/
  hooks/
  nearby/
  pages/
  profile/
  services/supabase/
  styles/
  utils/
```
