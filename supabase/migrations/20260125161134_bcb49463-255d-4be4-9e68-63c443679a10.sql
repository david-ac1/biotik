-- Create role enum
CREATE TYPE public.app_role AS ENUM ('farmer', 'buyer', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  farm_name TEXT,
  district TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Create batches table (core entity for Biotik)
CREATE TABLE public.batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  batch_code TEXT UNIQUE NOT NULL,
  breed TEXT NOT NULL, -- 'Cobb 500', 'Ross 308', 'Hubbard'
  start_date DATE NOT NULL,
  expected_maturity_days INT DEFAULT 42,
  initial_count INT NOT NULL,
  current_count INT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  stewardship_grade TEXT DEFAULT 'pending' CHECK (stewardship_grade IN ('pending', 'gold', 'silver', 'standard')),
  integrity_score DECIMAL(5,2) DEFAULT 0,
  is_available_for_sale BOOLEAN DEFAULT false,
  price_per_kg DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create daily_logs table (Biotik Log)
CREATE TABLE public.daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  day_number INT NOT NULL,
  mortality_count INT DEFAULT 0,
  feed_consumed_kg DECIMAL(10,2),
  avg_weight_g DECIMAL(10,2),
  notes TEXT,
  logged_via TEXT DEFAULT 'dashboard' CHECK (logged_via IN ('dashboard', 'whatsapp')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(batch_id, log_date)
);

-- Create evidence_photos table (Biotik Trace)
CREATE TABLE public.evidence_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_id UUID REFERENCES public.daily_logs(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  photo_type TEXT NOT NULL CHECK (photo_type IN ('flock', 'feed_bag', 'environment')),
  exif_gps_lat DECIMAL(10,8),
  exif_gps_lng DECIMAL(11,8),
  exif_timestamp TIMESTAMPTZ,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'flagged')),
  ai_analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table (Biotik Market)
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  quantity_kg DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  premium_percentage DECIMAL(5,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'completed', 'cancelled')),
  delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Batches policies
CREATE POLICY "Farmers can manage their own batches"
  ON public.batches FOR ALL
  TO authenticated
  USING (farmer_id = auth.uid());

CREATE POLICY "Buyers can view available batches"
  ON public.batches FOR SELECT
  TO authenticated
  USING (is_available_for_sale = true AND status = 'completed');

CREATE POLICY "Admins can view all batches"
  ON public.batches FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update batches"
  ON public.batches FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Daily logs policies
CREATE POLICY "Farmers can manage logs for their batches"
  ON public.daily_logs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.batches
      WHERE batches.id = daily_logs.batch_id
      AND batches.farmer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all logs"
  ON public.daily_logs FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Evidence photos policies
CREATE POLICY "Farmers can manage photos for their logs"
  ON public.evidence_photos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.daily_logs
      JOIN public.batches ON batches.id = daily_logs.batch_id
      WHERE daily_logs.id = evidence_photos.log_id
      AND batches.farmer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all photos"
  ON public.evidence_photos FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Orders policies
CREATE POLICY "Buyers can manage their own orders"
  ON public.orders FOR ALL
  TO authenticated
  USING (buyer_id = auth.uid());

CREATE POLICY "Farmers can view orders for their batches"
  ON public.orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.batches
      WHERE batches.id = orders.batch_id
      AND batches.farmer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create trigger to auto-assign default role on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'farmer'));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_batches_updated_at
  BEFORE UPDATE ON public.batches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();