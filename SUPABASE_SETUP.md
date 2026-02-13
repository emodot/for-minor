# Supabase setup for Memory Vault (Phase 5)

Do these steps in your [Supabase Dashboard](https://supabase.com/dashboard) → your project.

---

## Upload page – what to do in the Dashboard

If you use the **Upload memories** page in the app (`/upload`), do the following so uploads work.

### Step 1: Table + RLS (memories)

In **SQL Editor**, run:

```sql
-- Create table (if not exists)
create table if not exists memories (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('photo','voice','letter')),
  title text,
  content text,
  file_url text,
  created_at timestamp default now()
);

alter table memories enable row level security (RLS);

-- Read: so the app can show memories
create policy "Authenticated users can read memories"
  on memories for select to authenticated using (true);

-- Insert: so the upload page can add new rows
create policy "Authenticated users can insert memories"
  on memories for insert to authenticated with check (true);
```

(If you already have the table and the SELECT policy, just add the INSERT policy.)

### Step 2: Storage buckets

In **Storage**:

1. **New bucket**
   - Name: `photos`
   - **Public bucket**: ON (so the app can show images from the stored URL).
   - Create.
2. **New bucket**
   - Name: `voice-notes`
   - **Public bucket**: ON.
   - Create.

### Step 3: Storage policies (allow uploads)

For **each** bucket (`photos` and `voice-notes`):

1. Open the bucket → **Policies** (or **Configuration** → Policies).
2. **New policy** → choose **For full customization** (or “Create policy from scratch”).
3. Add a policy that allows **authenticated** users to upload and read:

**Policy 1 – allow upload (INSERT)**

- **Policy name**: `Authenticated can upload`
- **Allowed operation**: `INSERT` (or “Allow uploads”)
- **Target roles**: `authenticated`
- **WITH CHECK expression**: `true`

**Policy 2 – allow read (SELECT)**

- **Policy name**: `Authenticated can read`
- **Allowed operation**: `SELECT` (or “Allow reads”)
- **Target roles**: `authenticated`
- **USING expression**: `true`

**Or run this in SQL Editor** (after creating the buckets):

```sql
-- Allow authenticated users to upload and read from photos
create policy "Authenticated upload photos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'photos');
create policy "Authenticated read photos"
  on storage.objects for select to authenticated
  using (bucket_id = 'photos');

-- Allow authenticated users to upload and read from voice-notes
create policy "Authenticated upload voice-notes"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'voice-notes');
create policy "Authenticated read voice-notes"
  on storage.objects for select to authenticated
  using (bucket_id = 'voice-notes');
```

### Step 4: Done

After that, the **Upload memories** page can:

- Upload multiple photos to `photos` and create `memories` rows with `file_url`.
- Upload multiple audio files to `voice-notes` and create `memories` rows.
- Save letters (title + content) with no file.

---

## 1. Create the `memories` table (manual setup)

Go to **SQL Editor** → New query. Run:

```sql
-- Memories table (skip if you already ran supabase-schema.sql)
create table if not exists memories (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('photo','voice','letter')),
  title text,
  content text,
  file_url text,
  created_at timestamp default now()
);

-- Allow logged-in users to read all memories (single-user app)
alter table memories enable row level security (RLS);

create policy "Authenticated users can read memories"
  on memories for select
  to authenticated
  using (true);
```

If you want to insert memories only from the Dashboard (not from the app), add:

```sql
create policy "Authenticated users can insert memories"
  on memories for insert
  to authenticated
  with check (true);
```

---

## 2. Create storage buckets

Go to **Storage** in the sidebar.

### Option A: Public buckets (easiest – app works with plain URLs)

1. Click **New bucket**.
   - Name: `photos`
   - **Public bucket**: ON (so the app can use the URL from `file_url` as-is).
2. Create another bucket:
   - Name: `voice-notes`
   - **Public bucket**: ON.

### Option B: Private buckets

1. Create bucket `photos`, leave it **private**.
2. Create bucket `voice-notes`, leave it **private**.
3. For each bucket, go to **Policies** → **New policy** → “For full customization”:
   - Policy name: `Authenticated read`
   - Allowed operation: **SELECT (get)**
   - Target roles: `authenticated`
   - USING expression: `true`

Then in your app you must use **signed URLs** when showing images/audio (the app would need a small change to generate signed URLs from the stored path). For the simplest setup, use **Option A** (public buckets).

---

## 3. Add memories (Table Editor)

Go to **Table Editor** → **memories** → **Insert row**.

### Photos

- **type**: `photo`
- **title**: e.g. "Beach day"
- **content**: optional caption
- **file_url**: full image URL (see step 4)

### Voice notes

- **type**: `voice`
- **title**: e.g. "Message for you"
- **content**: optional note
- **file_url**: full audio URL (see step 4)

### Letters (no file)

- **type**: `letter`
- **title**: e.g. "Letter 1"
- **content**: the letter text (plain text or HTML)
- **file_url**: leave empty

---

## 4. Upload files and get URLs (for photos & voice notes)

### If buckets are public

1. Go to **Storage** → **photos**.
2. **Upload** your image(s).
3. Click a file → **Copy URL** (or use the path and your project URL).
   - Format: `https://<project-ref>.supabase.co/storage/v1/object/public/photos/<filename>`
4. Paste that URL into the **file_url** column of the corresponding row in **memories** (or add the row with that URL).
5. Repeat for **voice-notes**: upload audio files, copy URL, set **file_url** in memories.

### If buckets are private

Upload the same way, but the public URL will not work. You’d store only the **path** (e.g. `photo.jpg`) in `file_url` and change the app to call `createSignedUrl(path, expirySeconds)` when displaying; for the minimal setup, use public buckets.

---

## 5. Quick checklist

| Step | Where | What |
|------|--------|------|
| Table | SQL Editor | Run the `memories` + RLS SQL (SELECT + INSERT for upload page) |
| Buckets | Storage | Create `photos` and `voice-notes` (public) |
| Storage policies | Each bucket → Policies | Allow `authenticated` to INSERT and SELECT |
| Memories RLS | memories table | SELECT + INSERT for `authenticated` |

After this, the **Upload memories** page and the **Memories** (Photos, Voice notes, Letters) pages will work.
