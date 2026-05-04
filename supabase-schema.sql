-- 과외 트래커 — Supabase 스키마
-- Supabase 대시보드 > SQL Editor에서 한 번 실행하세요.

-- 1. 데이터 테이블: 사용자별 1행, 모든 데이터를 JSON으로 저장 (단일 사용자 앱이라 단순화)
create table if not exists public.tutor_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2. 자동으로 updated_at 갱신
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_tutor_data_updated_at on public.tutor_data;
create trigger trg_tutor_data_updated_at
  before update on public.tutor_data
  for each row execute function public.set_updated_at();

-- 3. RLS(Row Level Security): 본인 데이터만 접근
alter table public.tutor_data enable row level security;

drop policy if exists "Users access own data" on public.tutor_data;
create policy "Users access own data"
  on public.tutor_data
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 끝. 이제 클라이언트에서 anon key로 접근 가능 (RLS가 본인 데이터만 보호).
