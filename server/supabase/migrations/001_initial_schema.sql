-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create profiles table (synced with auth.users via trigger)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create medications table (reference data, public readable)
create table if not exists public.medications (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  description text,
  common_uses text[],
  side_effects text[],
  interactions text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create prescriptions table (user-specific medication schedules)
create table if not exists public.prescriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  medication_id uuid not null references public.medications(id) on delete restrict,
  medication_name text not null,
  dosage text not null,
  unit text not null default 'mg',
  frequency text not null,
  frequency_per_day integer not null default 1,
  start_date date not null,
  end_date date,
  notes text,
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create dose_logs table (adherence tracking)
create table if not exists public.dose_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  prescription_id uuid not null references public.prescriptions(id) on delete cascade,
  logged_at timestamp with time zone not null,
  taken_at timestamp with time zone,
  status text not null default 'missed' check (status in ('taken', 'missed', 'skipped')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for performance
create index if not exists prescriptions_user_id_idx on public.prescriptions(user_id);
create index if not exists prescriptions_medication_id_idx on public.prescriptions(medication_id);
create index if not exists dose_logs_user_id_idx on public.dose_logs(user_id);
create index if not exists dose_logs_prescription_id_idx on public.dose_logs(prescription_id);
create index if not exists dose_logs_taken_at_idx on public.dose_logs(taken_at);

-- Enable row level security
alter table public.profiles enable row level security;
alter table public.medications enable row level security;
alter table public.prescriptions enable row level security;
alter table public.dose_logs enable row level security;

-- RLS Policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- RLS Policies for medications (public read-only)
create policy "Anyone can read medications"
  on public.medications for select
  using (true);

-- RLS Policies for prescriptions
create policy "Users can view their own prescriptions"
  on public.prescriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own prescriptions"
  on public.prescriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own prescriptions"
  on public.prescriptions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own prescriptions"
  on public.prescriptions for delete
  using (auth.uid() = user_id);

-- RLS Policies for dose_logs
create policy "Users can view their own dose logs"
  on public.dose_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own dose logs"
  on public.dose_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own dose logs"
  on public.dose_logs for update
  using (auth.uid() = user_id);

-- Function to automatically create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on sign up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
