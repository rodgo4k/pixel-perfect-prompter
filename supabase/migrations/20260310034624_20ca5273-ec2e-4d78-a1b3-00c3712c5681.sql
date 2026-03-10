
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create scan_groups table
CREATE TABLE public.scan_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.scan_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Scan groups viewable by everyone" ON public.scan_groups FOR SELECT USING (true);
CREATE POLICY "Admins can insert scan groups" ON public.scan_groups FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update scan groups" ON public.scan_groups FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete scan groups" ON public.scan_groups FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Create mangas table
CREATE TABLE public.mangas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  cover_url TEXT,
  description TEXT,
  author TEXT,
  artist TEXT,
  status TEXT DEFAULT 'Em lançamento',
  demographic TEXT,
  genres TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mangas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mangas viewable by everyone" ON public.mangas FOR SELECT USING (true);
CREATE POLICY "Admins can insert mangas" ON public.mangas FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update mangas" ON public.mangas FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete mangas" ON public.mangas FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Create chapters table
CREATE TABLE public.chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manga_id UUID NOT NULL REFERENCES public.mangas(id) ON DELETE CASCADE,
  number TEXT NOT NULL,
  volume TEXT,
  title TEXT,
  is_extra BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  images_count INT DEFAULT 0,
  images_size TEXT,
  views INT DEFAULT 0,
  scan_group_id UUID REFERENCES public.scan_groups(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visible chapters viewable by everyone" ON public.chapters FOR SELECT USING (is_visible = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert chapters" ON public.chapters FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update chapters" ON public.chapters FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete chapters" ON public.chapters FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Create chapter_images table
CREATE TABLE public.chapter_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  page_number INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chapter_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chapter images viewable by everyone" ON public.chapter_images FOR SELECT USING (true);
CREATE POLICY "Admins can insert chapter images" ON public.chapter_images FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update chapter images" ON public.chapter_images FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete chapter images" ON public.chapter_images FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for manga images
INSERT INTO storage.buckets (id, name, public) VALUES ('manga-images', 'manga-images', true);

CREATE POLICY "Anyone can view manga images" ON storage.objects FOR SELECT USING (bucket_id = 'manga-images');
CREATE POLICY "Authenticated can upload manga images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'manga-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update manga images" ON storage.objects FOR UPDATE USING (bucket_id = 'manga-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete manga images" ON storage.objects FOR DELETE USING (bucket_id = 'manga-images' AND auth.role() = 'authenticated');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mangas_updated_at BEFORE UPDATE ON public.mangas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON public.chapters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
