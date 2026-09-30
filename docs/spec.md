# 미니 방명록 스펙

회원가입/로그인 없이, 글을 쓸 때 입력한 비밀번호로 본인 글의 수정·삭제 권한만 확인하는 방명록.

## 기술 스택

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- DB: Neon Postgres (`@neondatabase/serverless`, 직접 SQL, 파라미터 바인딩 필수)
- 해시: `bcryptjs` (cost 10)
- 테스트: Vitest (단위 테스트만)
- 배포: GitHub 연동 Vercel 자동 배포
- 개발 도구: Claude Code + Matt Pocock skills

> 이 프로젝트의 Next.js는 기존 버전과 다르다. 코드 작성 전 `node_modules/next/dist/docs/`를 확인한다 ([AGENTS.md](../AGENTS.md)).

## 기능 요구사항

### F1. 작성
- 누구나 이름, 메시지, 비밀번호를 입력해 새 글을 남길 수 있다.
- 작성 폼에 "비밀번호를 잊으면 수정·삭제할 수 없습니다" 안내를 표시한다.

### F2. 조회
- 누구나 전체 글 목록을 한 번에 볼 수 있다. 최신 작성순(`created_at DESC, id DESC`). 페이지 나누기나 "더 보기"는 없다.
- 각 글에는 이름, 메시지, 작성 시각을 표시한다. 수정된 글은 작성 시각 뒤에 괄호로 수정 시각을 붙인다.
  - 표시 형식: `2026-09-30 14:32 (수정됨 2026-09-30 15:01)`; 수정하지 않은 글은 괄호 생략.
  - 시간대는 Asia/Seoul, 서버에서 포맷한다. 상대 시간("3분 전")은 쓰지 않는다.
- 메시지의 줄바꿈은 유지한다(`white-space: pre-wrap`).
- 응답·화면·props 어디에도 비밀번호 해시를 노출하지 않는다.

### F3. 수정
- 글쓴이는 비밀번호를 입력해 자신의 글의 **메시지**만 수정할 수 있다. 이름과 비밀번호는 바뀌지 않는다.
- 비밀번호가 일치하지 않으면 수정은 거부되고, 해당 글 카드 안에 "비밀번호가 일치하지 않습니다"를 표시한다. 입력한 내용은 유지한다.
- 수정 성공 시 `updated_at`을 기록하고 "수정됨"을 표시한다. `created_at`은 바뀌지 않는다.

### F4. 삭제
- 글쓴이는 비밀번호를 입력해 자신의 글을 삭제할 수 있다.
- 삭제 전에 "정말 삭제할까요?" 확인 단계를 거친다.
- 비밀번호가 일치하지 않으면 삭제는 거부되고, 해당 글 카드 안에 "비밀번호가 일치하지 않습니다"를 표시한다.
- 성공 시 DB에서 행을 완전히 삭제한다(hard delete).

### F5. 개발자 표시
- 화면(상단 헤더 또는 하단 푸터)에 개발자 **이름(소재형)** 과 **학번(202204225)** 을 항상 표시한다.

## 규칙

### 입력 검증 (서버에서 항상 재검증)
| 항목 | 규칙 |
| --- | --- |
| 이름 | trim 후 1~20자 |
| 메시지 | trim 후 1~500자, 공백만 있으면 거부, 줄바꿈 허용 |
| 비밀번호 | 4자 이상, 72바이트 이하 (bcrypt는 앞 72바이트만 사용, 한글은 약 24자) |

- HTML은 React 기본 escape에 맡긴다. `dangerouslySetInnerHTML`은 쓰지 않는다.

### 비밀번호
- `bcryptjs` cost 10으로 해시해 저장한다. 평문은 저장·로그 출력하지 않는다.
- 비밀번호 복구 기능은 없다.

## 데이터 모델

`db/migrations/001_init.sql`

```sql
CREATE TABLE entries (
  id              BIGSERIAL PRIMARY KEY,
  name            TEXT        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 20),
  message         TEXT        NOT NULL CHECK (char_length(message) BETWEEN 1 AND 500),
  password_hash   TEXT        NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ
);
CREATE INDEX entries_created_at_id_idx ON entries (created_at DESC, id DESC);
```

## 구조

- 페이지: `/` 단일 페이지. 작성 폼이 위, 글 목록이 아래. 한국어 UI, 모바일 우선 반응형, 다크모드는 시스템 설정을 따른다.
- 작성·수정·삭제: Server Actions (`'use server'`). 폼은 `useActionState`. 검증 오류와 비밀번호 불일치는 throw하지 않고 반환값으로 돌려준다. 모든 액션은 공개 POST 엔드포인트이므로 액션 안에서 검증과 비밀번호 확인을 수행한다.
- 목록: 서버 컴포넌트에서 전체 글을 DB에서 직접 조회한다. `cacheComponents`는 켜지 않고 `dynamic = 'force-dynamic'`. 변경 후 `revalidatePath('/')`. 별도 조회 API는 없다.
- `params`, `searchParams`는 비동기로 받는다(Next.js 16).
- 응답은 화면용 필드(`id`, `name`, `message`, `createdAt`, `updatedAt`)만 담는다.

## 환경

- Neon DB 하나를 개발·운영이 공유한다.
- `DATABASE_URL`은 `.env.local`(git 제외)과 Vercel 환경변수로 관리한다. 서버 전용이며 `NEXT_PUBLIC_` 접두사를 쓰지 않는다.
- Next 밖에서 도는 마이그레이션 스크립트는 `@next/env`의 `loadEnvConfig`로 `.env.local`을 읽는다.

## 테스트 (TDD)

- 단위 테스트(Vitest)만 작성한다: 입력 검증, 비밀번호 해시·검증.
- 통합·E2E 테스트는 범위 밖. 화면과 DB 동작은 배포 후 직접 확인한다.

## 제출 규칙 (실기시험)

- GitHub 저장소, Vercel 프로젝트, Neon 프로젝트 이름을 모두 **`guestbook-202204225`** 로 통일한다.
- GitHub 저장소는 반드시 **public** 이다.
- 제출물은 GitHub 저장소 URL 1개와 Vercel 배포 URL 1개이다. 배포 URL에서 작성·조회·수정·삭제가 실제로 동작해야 한다.
- 개발 도구 흐름: `/grill-with-docs → /to-spec → /to-tickets → /implement → /code-review`.
- 시험 시간 14:40~16:30. Vercel 빌드와 Neon 콜드 스타트 확인에 약 10분이 걸리므로 배포를 일찍 시작한다.

## 배포

- GitHub 저장소를 Vercel에 연결한다. `main` push는 운영, 브랜치·PR은 Preview.
- DB 마이그레이션은 배포 전에 `npm run db:migrate`로 수동 적용한다(빌드 중 자동 적용 없음).
- push 등 외부에 영향을 주는 작업은 그때마다 확인받고 진행한다.

## 범위

위 요구사항을 충족하는 결과물까지만 만든다. 그 외 기능은 넣지 않는다.

## 완료 기준

- F1~F5가 동작하고 모든 테스트가 통과한다.
- `npm run lint`와 `npm run build`가 통과한다.
- Vercel에 배포되어 운영 URL에서 작성·조회·수정·삭제와 비밀번호 불일치 안내를 확인했다.
