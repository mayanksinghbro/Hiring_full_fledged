-- =============================================================
--  HIRING PLATFORM — SUPABASE SCHEMA
--  Paste this entire file into: Supabase Dashboard → SQL Editor → New Query → Run
-- =============================================================

-- ──────────────────────────────────────────────────────────────
-- EXTENSIONS
-- ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";  -- gen_random_uuid() fallback

-- ──────────────────────────────────────────────────────────────
-- 1. COLLEGES
-- ──────────────────────────────────────────────────────────────
create table public.colleges (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  city       text,
  state      text,
  website    text,
  created_at timestamptz default now()
);
comment on table public.colleges is 'Universities / colleges that use the placement platform';

-- ──────────────────────────────────────────────────────────────
-- 2. COMPANIES
-- ──────────────────────────────────────────────────────────────
create table public.companies (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  website    text,
  industry   text,
  logo_url   text,
  created_at timestamptz default now()
);
comment on table public.companies is 'Recruiting companies that visit campuses';

-- ──────────────────────────────────────────────────────────────
-- 3. PROFILES  (extends Supabase Auth users)
-- ──────────────────────────────────────────────────────────────
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null check (role in ('student', 'college_admin', 'company_hr')),
  college_id uuid references public.colleges(id) on delete set null,
  company_id uuid references public.companies(id) on delete set null,
  full_name  text,
  avatar_url text,
  created_at timestamptz default now()
);
comment on table public.profiles is 'Extended profile for every auth user; role determines which dashboard they see';

-- Auto-create a profile row when a new user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ──────────────────────────────────────────────────────────────
-- 4. STUDENTS
-- ──────────────────────────────────────────────────────────────
create table public.students (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid unique references public.profiles(id) on delete cascade,
  college_id  uuid references public.colleges(id) on delete set null,
  roll_number text,
  branch      text,           -- e.g. 'Computer Science', 'Information Technology'
  batch_year  int,            -- graduation year e.g. 2026
  cgpa        numeric(3,1),
  linkedin    text,
  github      text,
  portfolio   text,
  phone       text,
  is_placed   boolean default false,
  created_at  timestamptz default now()
);
comment on table public.students is 'Student academic and contact details; one row per student user';

-- ──────────────────────────────────────────────────────────────
-- 5. SKILLS  (master list)
-- ──────────────────────────────────────────────────────────────
create table public.skills (
  id   uuid primary key default gen_random_uuid(),
  name text not null unique   -- e.g. 'React', 'Python', 'System Design'
);
comment on table public.skills is 'Canonical skill names shared across students and job requirements';

-- ──────────────────────────────────────────────────────────────
-- 6. STUDENT_SKILLS  (many-to-many)
-- ──────────────────────────────────────────────────────────────
create table public.student_skills (
  student_id uuid references public.students(id) on delete cascade,
  skill_id   uuid references public.skills(id) on delete cascade,
  primary key (student_id, skill_id)
);
comment on table public.student_skills is 'Skills a student has listed on their profile';

-- ──────────────────────────────────────────────────────────────
-- 7. RESUMES
-- ──────────────────────────────────────────────────────────────
create table public.resumes (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid references public.students(id) on delete cascade,
  file_name    text,
  storage_path text,        -- path inside Supabase Storage bucket named "resumes"
  parsed_text  text,        -- raw text extracted from the PDF (for AI matching)
  is_primary   boolean default true,
  uploaded_at  timestamptz default now()
);
comment on table public.resumes is 'Uploaded resume files; parsed_text is used for AI skill matching';

-- ──────────────────────────────────────────────────────────────
-- 8. PLACEMENT_DRIVES  (a company visiting a college)
-- ──────────────────────────────────────────────────────────────
create table public.placement_drives (
  id         uuid primary key default gen_random_uuid(),
  college_id uuid references public.colleges(id) on delete cascade,
  company_id uuid references public.companies(id) on delete cascade,
  drive_date date,
  status     text default 'upcoming'
             check (status in ('upcoming', 'ongoing', 'completed', 'cancelled')),
  description text,
  created_at  timestamptz default now()
);
comment on table public.placement_drives is 'A specific campus recruitment drive linking a college and a company';

-- ──────────────────────────────────────────────────────────────
-- 9. JOB_POSTINGS  (a role within a drive)
-- ──────────────────────────────────────────────────────────────
create table public.job_postings (
  id          uuid primary key default gen_random_uuid(),
  drive_id    uuid references public.placement_drives(id) on delete set null,
  company_id  uuid references public.companies(id) on delete cascade,
  title       text not null,           -- e.g. 'SDE-1', 'Full Stack Dev'
  description text,
  package_lpa numeric(5,2),            -- e.g. 32.00 for ₹32 LPA
  role_type   text default 'full_time'
              check (role_type in ('full_time', 'internship')),
  status      text default 'active'
              check (status in ('draft', 'active', 'closed')),
  created_at  timestamptz default now()
);
comment on table public.job_postings is 'Individual job roles posted by companies during a placement drive';

-- ──────────────────────────────────────────────────────────────
-- 10. JOB_REQUIREMENTS  (many-to-many: job ↔ skills)
-- ──────────────────────────────────────────────────────────────
create table public.job_requirements (
  job_id   uuid references public.job_postings(id) on delete cascade,
  skill_id uuid references public.skills(id) on delete cascade,
  primary key (job_id, skill_id)
);
comment on table public.job_requirements is 'Skills required for a given job posting';

-- ──────────────────────────────────────────────────────────────
-- 11. APPLICATIONS  (student applying for a job — the "candidate" record)
-- ──────────────────────────────────────────────────────────────
create table public.applications (
  id               uuid primary key default gen_random_uuid(),
  job_id           uuid references public.job_postings(id) on delete cascade,
  student_id       uuid references public.students(id) on delete cascade,
  resume_id        uuid references public.resumes(id) on delete set null,
  match_score      numeric(5,2),     -- 0-100, AI-generated
  ai_justification text,             -- AI explanation of the match score
  status           text default 'applied'
                   check (status in ('applied','shortlisted','interview','offered','rejected','placed')),
  shortlisted      boolean default false,
  applied_at       timestamptz default now(),
  unique (job_id, student_id)
);
comment on table public.applications is 'A student''s application to a specific job posting; central record for tracking progress';

-- ──────────────────────────────────────────────────────────────
-- 12. PLACEMENT_OFFERS  (final offer when placed)
-- ──────────────────────────────────────────────────────────────
create table public.placement_offers (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid references public.applications(id) on delete cascade,
  student_id     uuid references public.students(id) on delete cascade,
  company_id     uuid references public.companies(id) on delete cascade,
  job_id         uuid references public.job_postings(id) on delete cascade,
  package_lpa    numeric(5,2),
  offer_date     date,
  joining_date   date,
  status         text default 'pending'
                 check (status in ('pending','accepted','declined')),
  created_at     timestamptz default now()
);
comment on table public.placement_offers is 'Formal offer letter record; created when a company extends an offer';

-- ──────────────────────────────────────────────────────────────
-- 13. GAP_ANALYSES  (student x company x role)
-- ──────────────────────────────────────────────────────────────
create table public.gap_analyses (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid references public.students(id) on delete cascade,
  company_id  uuid references public.companies(id) on delete cascade,
  target_role text,       -- e.g. 'Frontend Dev', 'Backend Dev', 'Data Scientist'
  created_at  timestamptz default now()
);
comment on table public.gap_analyses is 'A skill gap analysis for a student targeting a specific company and role';

-- ──────────────────────────────────────────────────────────────
-- 14. GAP_ITEMS  (individual gaps within an analysis)
-- ──────────────────────────────────────────────────────────────
create table public.gap_items (
  id              uuid primary key default gen_random_uuid(),
  gap_analysis_id uuid references public.gap_analyses(id) on delete cascade,
  skill_name      text,
  severity        text check (severity in ('high','medium','low')),
  description     text
);
comment on table public.gap_items is 'Individual skill gaps identified in a gap analysis';

-- ──────────────────────────────────────────────────────────────
-- 15. ROADMAP_STEPS  (personalised learning plan steps)
-- ──────────────────────────────────────────────────────────────
create table public.roadmap_steps (
  id              uuid primary key default gen_random_uuid(),
  gap_analysis_id uuid references public.gap_analyses(id) on delete cascade,
  phase           text,       -- e.g. 'Week 1-2', 'Month 2'
  title           text,
  description     text,
  step_type       text check (step_type in ('learn','practice','project','milestone')),
  order_index     int default 0
);
comment on table public.roadmap_steps is 'Ordered learning roadmap steps generated within a gap analysis';

-- ──────────────────────────────────────────────────────────────
-- 16. COURSES  (recommended courses linked to gap analyses)
-- ──────────────────────────────────────────────────────────────
create table public.courses (
  id              uuid primary key default gen_random_uuid(),
  gap_analysis_id uuid references public.gap_analyses(id) on delete cascade,
  title           text,
  platform        text,        -- e.g. 'Udemy', 'Coursera', 'MIT OCW'
  instructor      text,
  rating          numeric(2,1),
  url             text,
  duration_text   text,        -- e.g. '24 hours', '40 hours'
  price           text         -- e.g. '₹649', 'Free'
);
comment on table public.courses is 'Recommended courses surfaced in a gap analysis roadmap';

-- ──────────────────────────────────────────────────────────────
-- INDEXES  (speeds up common queries)
-- ──────────────────────────────────────────────────────────────
create index on public.students (college_id);
create index on public.students (profile_id);
create index on public.resumes (student_id);
create index on public.placement_drives (college_id, company_id);
create index on public.job_postings (company_id);
create index on public.job_postings (status);
create index on public.applications (job_id);
create index on public.applications (student_id);
create index on public.applications (status);
create index on public.placement_offers (student_id);
create index on public.gap_analyses (student_id, company_id);

-- ──────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY  (RLS)
-- ──────────────────────────────────────────────────────────────
-- Enable RLS on all tables
alter table public.colleges           enable row level security;
alter table public.companies          enable row level security;
alter table public.profiles           enable row level security;
alter table public.students           enable row level security;
alter table public.skills             enable row level security;
alter table public.student_skills     enable row level security;
alter table public.resumes            enable row level security;
alter table public.placement_drives   enable row level security;
alter table public.job_postings       enable row level security;
alter table public.job_requirements   enable row level security;
alter table public.applications       enable row level security;
alter table public.placement_offers   enable row level security;
alter table public.gap_analyses       enable row level security;
alter table public.gap_items          enable row level security;
alter table public.roadmap_steps      enable row level security;
alter table public.courses            enable row level security;

-- ── Helper: get the profile row of the current authenticated user ──
create or replace function public.my_profile()
returns public.profiles
language sql stable security definer
as $$
  select * from public.profiles where id = auth.uid();
$$;

-- ── Helper: get the student row of the current authenticated user ──
create or replace function public.my_student_id()
returns uuid
language sql stable security definer
as $$
  select id from public.students where profile_id = auth.uid();
$$;

-- ──────────────────────────────────────────────────────────────
-- PROFILES policies
-- ──────────────────────────────────────────────────────────────
-- Anyone can read public profiles; only owner can update their own
create policy "Read own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "Update own profile"
  on public.profiles for update
  using (id = auth.uid());

-- ──────────────────────────────────────────────────────────────
-- COLLEGES policies
-- ──────────────────────────────────────────────────────────────
create policy "Anyone can read colleges"
  on public.colleges for select
  using (true);

create policy "College admin can update own college"
  on public.colleges for update
  using ((select college_id from public.profiles where id = auth.uid()) = id);

-- ──────────────────────────────────────────────────────────────
-- COMPANIES policies
-- ──────────────────────────────────────────────────────────────
create policy "Anyone can read companies"
  on public.companies for select
  using (true);

create policy "Company HR can update own company"
  on public.companies for update
  using ((select company_id from public.profiles where id = auth.uid()) = id);

-- ──────────────────────────────────────────────────────────────
-- STUDENTS policies
-- ──────────────────────────────────────────────────────────────
create policy "Student can read/write own record"
  on public.students for all
  using (profile_id = auth.uid());

create policy "College admin can read students in their college"
  on public.students for select
  using (
    college_id = (select college_id from public.profiles where id = auth.uid())
  );

create policy "Company HR can read shortlisted students via applications"
  on public.students for select
  using (
    exists (
      select 1 from public.applications a
      join public.job_postings jp on jp.id = a.job_id
      where a.student_id = students.id
        and a.shortlisted = true
        and jp.company_id = (select company_id from public.profiles where id = auth.uid())
    )
  );

-- ──────────────────────────────────────────────────────────────
-- SKILLS policies
-- ──────────────────────────────────────────────────────────────
create policy "Anyone can read skills"
  on public.skills for select
  using (true);

create policy "College admin can insert skills"
  on public.skills for insert
  with check (
    (select role from public.profiles where id = auth.uid()) in ('college_admin','company_hr')
  );

-- ──────────────────────────────────────────────────────────────
-- STUDENT_SKILLS policies
-- ──────────────────────────────────────────────────────────────
create policy "Student manages own skills"
  on public.student_skills for all
  using (
    student_id = (select id from public.students where profile_id = auth.uid())
  );

create policy "Others can read student skills"
  on public.student_skills for select
  using (true);

-- ──────────────────────────────────────────────────────────────
-- RESUMES policies
-- ──────────────────────────────────────────────────────────────
create policy "Student manages own resumes"
  on public.resumes for all
  using (
    student_id = (select id from public.students where profile_id = auth.uid())
  );

create policy "College admin can read resumes in college"
  on public.resumes for select
  using (
    exists (
      select 1 from public.students s
      where s.id = resumes.student_id
        and s.college_id = (select college_id from public.profiles where id = auth.uid())
    )
  );

create policy "Company HR can read shortlisted resumes"
  on public.resumes for select
  using (
    exists (
      select 1 from public.applications a
      where a.resume_id = resumes.id
        and a.shortlisted = true
        and exists (
          select 1 from public.job_postings jp
          where jp.id = a.job_id
            and jp.company_id = (select company_id from public.profiles where id = auth.uid())
        )
    )
  );

-- ──────────────────────────────────────────────────────────────
-- PLACEMENT_DRIVES policies
-- ──────────────────────────────────────────────────────────────
create policy "Anyone can read drives"
  on public.placement_drives for select
  using (true);

create policy "College admin manages drives for their college"
  on public.placement_drives for all
  using (
    college_id = (select college_id from public.profiles where id = auth.uid())
  );

-- ──────────────────────────────────────────────────────────────
-- JOB_POSTINGS policies
-- ──────────────────────────────────────────────────────────────
create policy "Anyone can read active job postings"
  on public.job_postings for select
  using (status = 'active' or company_id = (select company_id from public.profiles where id = auth.uid()));

create policy "Company HR manages own job postings"
  on public.job_postings for all
  using (
    company_id = (select company_id from public.profiles where id = auth.uid())
  );

-- ──────────────────────────────────────────────────────────────
-- JOB_REQUIREMENTS policies
-- ──────────────────────────────────────────────────────────────
create policy "Anyone can read job requirements"
  on public.job_requirements for select
  using (true);

create policy "Company HR manages requirements for own jobs"
  on public.job_requirements for all
  using (
    exists (
      select 1 from public.job_postings jp
      where jp.id = job_requirements.job_id
        and jp.company_id = (select company_id from public.profiles where id = auth.uid())
    )
  );

-- ──────────────────────────────────────────────────────────────
-- APPLICATIONS policies
-- ──────────────────────────────────────────────────────────────
create policy "Student manages own applications"
  on public.applications for all
  using (
    student_id = (select id from public.students where profile_id = auth.uid())
  );

create policy "College admin can read all applications in their college"
  on public.applications for select
  using (
    exists (
      select 1 from public.students s
      where s.id = applications.student_id
        and s.college_id = (select college_id from public.profiles where id = auth.uid())
    )
  );

create policy "Company HR manages applications for own jobs"
  on public.applications for all
  using (
    exists (
      select 1 from public.job_postings jp
      where jp.id = applications.job_id
        and jp.company_id = (select company_id from public.profiles where id = auth.uid())
    )
  );

-- ──────────────────────────────────────────────────────────────
-- PLACEMENT_OFFERS policies
-- ──────────────────────────────────────────────────────────────
create policy "Student reads own offers"
  on public.placement_offers for select
  using (
    student_id = (select id from public.students where profile_id = auth.uid())
  );

create policy "Student accepts/declines own offer"
  on public.placement_offers for update
  using (
    student_id = (select id from public.students where profile_id = auth.uid())
  );

create policy "College admin reads all offers in college"
  on public.placement_offers for select
  using (
    exists (
      select 1 from public.students s
      where s.id = placement_offers.student_id
        and s.college_id = (select college_id from public.profiles where id = auth.uid())
    )
  );

create policy "Company HR manages own offers"
  on public.placement_offers for all
  using (
    company_id = (select company_id from public.profiles where id = auth.uid())
  );

-- ──────────────────────────────────────────────────────────────
-- GAP_ANALYSES policies
-- ──────────────────────────────────────────────────────────────
create policy "Student manages own gap analyses"
  on public.gap_analyses for all
  using (
    student_id = (select id from public.students where profile_id = auth.uid())
  );

-- ──────────────────────────────────────────────────────────────
-- GAP_ITEMS / ROADMAP_STEPS / COURSES — follow gap_analysis ownership
-- ──────────────────────────────────────────────────────────────
create policy "Student manages own gap items"
  on public.gap_items for all
  using (
    exists (
      select 1 from public.gap_analyses ga
      where ga.id = gap_items.gap_analysis_id
        and ga.student_id = (select id from public.students where profile_id = auth.uid())
    )
  );

create policy "Student manages own roadmap steps"
  on public.roadmap_steps for all
  using (
    exists (
      select 1 from public.gap_analyses ga
      where ga.id = roadmap_steps.gap_analysis_id
        and ga.student_id = (select id from public.students where profile_id = auth.uid())
    )
  );

create policy "Student manages own courses"
  on public.courses for all
  using (
    exists (
      select 1 from public.gap_analyses ga
      where ga.id = courses.gap_analysis_id
        and ga.student_id = (select id from public.students where profile_id = auth.uid())
    )
  );
