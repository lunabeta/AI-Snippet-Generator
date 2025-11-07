-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  email text,
  created_at timestamptz DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create snippets table
CREATE TABLE IF NOT EXISTS public.snippets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  language text NOT NULL,
  code text NOT NULL,
  tags text[] DEFAULT ARRAY[]::text[],
  is_public boolean DEFAULT FALSE,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own snippets"
  ON public.snippets FOR SELECT
  USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can insert their own snippets"
  ON public.snippets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own snippets"
  ON public.snippets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own snippets"
  ON public.snippets FOR DELETE
  USING (auth.uid() = user_id);

-- Create templates table
CREATE TABLE IF NOT EXISTS public.templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  prompt_template text NOT NULL,
  language text NOT NULL,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own templates"
  ON public.templates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own templates"
  ON public.templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
  ON public.templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
  ON public.templates FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for profile auto-creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.email),
    new.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
