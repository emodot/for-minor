# Valentine Memory Vault 💖

A private, emotion-first web application for storing memories, "Open When" messages, music, and a special Valentine reveal.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Supabase account with project created

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Supabase**
   - The `.env.local` file is already configured with your Supabase credentials
   - Run the SQL schema in `supabase-schema.sql` in your Supabase SQL Editor
   - Create two storage buckets in Supabase Dashboard > Storage:
     - `photos` (private)
     - `voice-notes` (private)

3. **Create a user**
   - Go to Supabase Dashboard > Authentication > Users
   - Create a new user manually (email/password)
   - This is the only user who can log in (no signup UI)

4. **Add your songs**
   - Edit `data/songs.ts` and add your songs to the three sections:
     - Songs That Feel Like You
     - Songs That Feel Like Us
     - Songs For Our Future
   - Each song needs: `id`, `title`, `artist`, `albumArt` (URL), and `note`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:3000`

## 📁 Project Structure

```
app/
├── page.tsx              # Landing page
├── login/               # Login page
├── home/                # Home navigation
├── memories/            # Memory vault
│   ├── photos/          # Photo grid
│   ├── voice-notes/     # Audio players
│   └── letters/         # Letter reading
├── open-when/           # Locked messages
├── music/               # Spotify visualizer
└── final/               # Valentine reveal
```

## 🗄️ Database Schema

The app uses three tables:
- `profiles` - User profile information
- `memories` - Photos, voice notes, and letters
- `open_when` - Time-locked messages

See `supabase-schema.sql` for the exact schema.

## 🎨 Features

- **Authentication**: Login-only (no signup)
- **Memory Vault**: Store and view photos, voice notes, and letters
- **Open When**: Date-locked messages that unlock on specific dates
- **Music Visualizer**: Display songs with emotional notes and animations
- **Final Reveal**: Cinematic Valentine proposal page with confetti

## 🛠️ Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase (Auth, Database, Storage)
- Canvas Confetti

## 📱 Mobile-First

The entire app is designed mobile-first and works beautifully on:
- Mobile Safari (iOS)
- Chrome Mobile (Android)
- Desktop browsers

## 🔒 Security

- All routes except `/login` and `/` are protected
- Middleware handles authentication
- Storage buckets are private
- No signup UI (user created manually in Supabase)

## 🚢 Deployment

Deploy to Vercel:

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## 📝 Notes

- Songs are stored in `data/songs.ts` - edit this file to add your music
- Open When messages unlock based on the `unlock_date` field
- Confetti triggers once per unlocked message (tracked in localStorage)
- All images from Supabase Storage are automatically allowed

## 💝 Enjoy!

This is built with love and emotion-first design. Every interaction is crafted to feel special.
