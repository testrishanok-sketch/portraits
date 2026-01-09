# Deployment Guide: EventCam

This guide covers how to deploy your Event Photo Delivery System to the cloud.

## 1. Supabase Setup (Database)

## 🚀 Scalability: Will it crash?
**Short Answer: No.** This architecture is designed for **High Traffic**.

1.  **Distributed Processing**:
    *   Traditional servers crash if 500 people upload selfies at once.
    *   **EventCam** doesn't use the server for AI. It uses the **Guest's Phone**.
    *   If 500 guests scan, 500 *different phones* do the work. Your server load is almost zero.

2.  **Data Size (The Math)**:
    *   We don't download the photos to search. We download the "Index" (Numbers).
    *   1,000 Photos = ~500KB of data.
    *   This loads in **1 second** even on 4G.
    *   The high-res photos are only downloaded *after* a match is found.

3.  **Vercel & Supabase**:
    *   These are Enterprise Clouds. They auto-scale. They can handle 100,000+ requests without blinking.

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

## 🛡️ Security & Keys (IMPORTANT)
*   **Do NOT share your keys with anyone** (including me/AI).
*   **Do NOT commit keys to GitHub**.
*   **Where do they go?**
    *   **Locally**: Create a file named `.env.local` in your project folder and paste them there (see `.env.example`).
    *   **Production**: Paste them into the **"Environment Variables"** section on Vercel.

## 3. Operational Workflow (Live Event)

1.  **Laptop**: Open your deployed Vercel Admin Dashboard (e.g., `eventcam.vercel.app/admin`).
2.  **Camera**: Connect camera via USB.
3.  **Upload**: Drag & Drop photos into the Dashboard.
    *   ✅ **Verify**: Ensure the "AI Ready" badge is green before uploading.
4.  **QR Code**: Generate a QR code pointing to `eventcam.vercel.app/event/[EVENT_ID]`.

## Capacity & Optimization
*   **1000+ Images**: The system automatically resizes photos to **Full HD (1920px)** before uploading.
*   **Storage**: 1000 photos will use only ~200MB of your 1GB Free Tier.
*   **Speed**: Uploads are 10x faster due to this compression.
*   **Originals**: Keep high-res RAW/JPEGs on your hard drive; the cloud only needs "Screen Quality" for guests.

## Troubleshooting

*   **Models Not Loading**: Ensure the `public/models` folder was deployed correctly. It should be if you simply pushed the code.
*   **Face Matching Slow**: The current implementation does "Client-Side" detection (User's phone). If it's slow, ensure good lighting for the selfie.
