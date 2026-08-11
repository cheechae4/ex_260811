-- 프로포즈 응답 저장 테이블
-- Supabase 대시보드 → SQL Editor 에서 이 파일 내용을 그대로 붙여넣고 실행하세요.

create table if not exists proposal_responses (
  id                    uuid primary key default gen_random_uuid(),
  groom_name            text not null,
  bride_name            text not null,
  wedding_date          date not null,
  date_is_tentative     boolean not null default false,   -- true = 아직 미정, 예상 날짜
  used_at               timestamptz not null default now(), -- 서비스(프로포즈 페이지) 사용 날짜
  days_until_wedding    integer not null,                  -- 결혼식날짜 - 이용날짜 (D-day, 음수면 이미 지남)
  page_version          text,                               -- 'minimal' | 'bugatti' | 'cute'
  created_at            timestamptz not null default now()
);

comment on table proposal_responses is '프로포즈 페이지에서 좋아!! 클릭 후 입력한 결혼식 날짜 응답 기록';
comment on column proposal_responses.date_is_tentative is '결혼식 날짜가 아직 확정되지 않은 예상 날짜인 경우 true';
comment on column proposal_responses.days_until_wedding is '결혼식까지 남은 일수 (used_at 기준). 음수면 이미 지난 날짜';

-- Row Level Security: 익명 키로는 삽입(insert)만 허용, 읽기/수정/삭제는 막습니다.
alter table proposal_responses enable row level security;

create policy "anon can insert proposal responses"
  on proposal_responses for insert
  to anon
  with check (true);

-- 읽기는 관리자(서비스 역할 키 또는 대시보드)에서만 — anon에는 select 정책을 주지 않습니다.
