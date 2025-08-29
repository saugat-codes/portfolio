-- Create migration file for Supabase
-- This will create all necessary tables and data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (for admin authentication)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    image TEXT,
    technologies TEXT[] DEFAULT '{}',
    demo_url TEXT,
    github_url TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    tags TEXT[] DEFAULT '{}',
    slug TEXT UNIQUE NOT NULL,
    featured BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    read_time INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);

-- Set up Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can view all blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Create policies for projects table
CREATE POLICY "Anyone can view projects" ON public.projects
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage projects" ON public.projects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Create policies for blog_posts table
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
    FOR SELECT USING (published_at <= NOW());

CREATE POLICY "Admins can view all blog posts" ON public.blog_posts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage blog posts" ON public.blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Create or replace function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create or replace function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop triggers if exist, then create
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data (only if tables are empty)
INSERT INTO public.projects (title, description, long_description, image, technologies, demo_url, github_url, featured)
SELECT 'E-Commerce Platform', 'A full-stack e-commerce solution with React, Node.js, and PostgreSQL', 'A comprehensive e-commerce platform built with modern web technologies. Features include user authentication, product catalog, shopping cart, payment processing with Stripe, order management, and admin dashboard.', '/placeholder.svg?height=300&width=500', ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe', 'TypeScript'], 'https://demo.example.com', 'https://github.com/username/ecommerce', true
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE title = 'E-Commerce Platform');

INSERT INTO public.projects (title, description, long_description, image, technologies, demo_url, github_url, featured)
SELECT 'Task Management App', 'A collaborative task management application with real-time updates', 'A modern task management application that enables teams to collaborate effectively. Built with Next.js and Socket.io for real-time updates.', '/placeholder.svg?height=300&width=500', ARRAY['Next.js', 'Socket.io', 'MongoDB', 'Tailwind CSS'], 'https://tasks.example.com', 'https://github.com/username/taskapp', true
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE title = 'Task Management App');

INSERT INTO public.blog_posts (title, excerpt, content, image, tags, slug, featured, published_at, read_time)
SELECT 'Building Scalable React Applications', 'Learn the best practices for building large-scale React applications that can grow with your team.', '<p>Building scalable React applications requires careful planning and adherence to best practices.</p>', '/placeholder.svg?height=300&width=500', ARRAY['React', 'JavaScript', 'Architecture'], 'building-scalable-react-applications', true, NOW() - INTERVAL '5 days', 8
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'building-scalable-react-applications');

INSERT INTO public.blog_posts (title, excerpt, content, image, tags, slug, featured, published_at, read_time)
SELECT 'The Future of Web Development', 'Exploring emerging trends and technologies that will shape the future of web development.', '<p>The web development landscape is constantly evolving, with new technologies emerging regularly.</p>', '/placeholder.svg?height=300&width=500', ARRAY['Web Development', 'Technology', 'Future'], 'future-of-web-development', true, NOW() - INTERVAL '2 days', 6
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'future-of-web-development');
