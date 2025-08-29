# Supabase Integration Setup Guide

This guide will help you set up Supabase as the backend for your Next.js portfolio with dynamic blogs and projects.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Choose a database password and remember it
4. Wait for the project to be set up (usually takes 2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Public anon key** (starts with `eyJ...`)
   - **Service role key** (starts with `eyJ...`) - Keep this secret!

## Step 3: Set Up Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Open the `supabase-schema.sql` file in this project
3. Copy all the SQL code and paste it into the SQL Editor
4. Click **Run** to execute the schema

This will create:
- `users` table for admin authentication
- `projects` table for your portfolio projects
- `blog_posts` table for your blog articles
- Proper indexes and Row Level Security (RLS) policies
- Sample data to get you started

## Step 5: Set Up Authentication (Optional)

If you want admin authentication:

1. In Supabase dashboard, go to **Authentication** > **Settings**
2. Configure your site URL (e.g., `http://localhost:3000`)
3. You can use email/password or OAuth providers

To create an admin user:
1. Go to **Authentication** > **Users**
2. Create a new user
3. In the **SQL Editor**, run:
   ```sql
   UPDATE public.users 
   SET role = 'admin' 
   WHERE email = 'your-admin-email@example.com';
   ```

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit your pages:
   - `/projects` - Should show projects from Supabase
   - `/blog` - Should show blog posts from Supabase
   - `/admin` - Admin panel for managing content

## Step 7: Customize Your Content

You can now:
- Add/edit/delete projects through the admin panel
- Create and manage blog posts
- Upload images to Supabase Storage (optional)

## API Endpoints

Your application now has the following API endpoints:

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/[id]` - Get a specific project
- `PUT /api/projects/[id]` - Update a project
- `DELETE /api/projects/[id]` - Delete a project

### Blog Posts
- `GET /api/blog` - Get all blog posts
- `POST /api/blog` - Create a new blog post
- `GET /api/blog/[slug]` - Get a specific blog post by slug
- `PUT /api/blog/[slug]` - Update a blog post
- `DELETE /api/blog/[slug]` - Delete a blog post

## Security Notes

- The `service_role_key` should only be used server-side and never exposed to the client
- Row Level Security (RLS) is enabled to ensure data security
- Only authenticated admin users can modify content
- Public users can only read published content

## Troubleshooting

### Common Issues:

1. **"Invalid API key"**: Double-check your environment variables
2. **"Permission denied"**: Make sure RLS policies are set up correctly
3. **"Table doesn't exist"**: Ensure you've run the SQL schema
4. **Build errors**: Restart your development server after adding environment variables

### Enable Realtime (Optional)

If you want real-time updates:
1. In Supabase dashboard, go to **Database** > **Replication**
2. Enable replication for `projects` and `blog_posts` tables

## Next Steps

- Set up image uploads with Supabase Storage
- Add more fields to your content types
- Implement search functionality
- Add user comments or reactions
- Set up email notifications for new posts

## Support

If you encounter issues:
1. Check the Supabase logs in your dashboard
2. Verify your environment variables
3. Ensure the database schema is properly set up
4. Check the browser console for client-side errors
