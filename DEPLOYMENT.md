# Deployment Guide: EventCam

This guide covers how to deploy your Event Photo Delivery System to the cloud.

## 1. Supabase Setup (Database)

1.  **Create Project**: Go to [database.new](https://database.new) and create a new project.
2.  **SQL Setup**: Go to the **SQL Editor** in Supabase and run this script to create the tables:

```sql
-- Create storage bucket for photos
insert into storage.buckets (id, name, public) values ('events', 'events', true);

-- Create table for Events
create table events (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  slug text unique
);

-- Create table for Faces (The AI Index)
create table faces (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events(id),
  photo_url text not null,
  descriptor float8[] not null, -- Stores the face numbers
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) - Optional for prototype, simplified here
alter table faces enable row level security;
create policy "Public Access" on faces for select using (true);
create policy "Public Insert" on faces for insert with check (true);
```

3.  **Get Keys**: Go to **Project Settings > API**. Copy:
    *   Project URL
    *   `anon` public key

## 2. Vercel Deployment (The App)

1.  **Push to GitHub**:
    *   Create a new repository on GitHub.
    *   Run:
        ```bash
        git remote add origin https://github.com/YOUR_USERNAME/eventcam.git
        git push -u origin main
        ```

2.  **Deploy on Vercel**:
    *   Go to [vercel.com/new](https://vercel.com/new).
    *   Import your `eventcam` repository.
    *   **Environment Variables**: Add the keys from Supabase:
        *   `NEXT_PUBLIC_SUPABASE_URL`: (Your URL)
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Your Key)
    *   Click **Deploy**.

## 3. Operational Workflow (Live Event)

1.  **Laptop**: Open your deployed Vercel Admin Dashboard (e.g., `eventcam.vercel.app/admin`).
2.  **Camera**: Connect camera via USB.
3.  **Upload**: Drag & Drop photos into the Dashboard.
    *   ✅ **Verify**: Ensure the "AI Ready" badge is green before uploading.
4.  **QR Code**: Generate a QR code pointing to `eventcam.vercel.app/event/[EVENT_ID]`.

## Troubleshooting

*   **Models Not Loading**: Ensure the `public/models` folder was deployed correctly. It should be if you simply pushed the code.
*   **Face Matching Slow**: The current implementation does "Client-Side" detection (User's phone). If it's slow, ensure good lighting for the selfie.
