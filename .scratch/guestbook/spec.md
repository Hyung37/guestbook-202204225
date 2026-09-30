# Spec: 미니 방명록

**Status:** ready-for-agent

## Problem Statement

방문자가 회원가입이나 로그인 없이 이름과 메시지를 남기고, 나중에 본인이 쓴 글만 고치거나 지울 수 있는 간단한 방명록이 필요하다. 계정이 없으므로 글쓴이임을 확인할 수단은 글을 쓸 때 함께 정한 비밀번호뿐이다. 비밀번호가 맞지 않을 때는 수정·삭제가 거부되었다는 사실이 분명히 안내되어야 한다.

## Solution

한 페이지짜리 한국어 방명록. 위쪽 작성 폼으로 이름, 메시지, 비밀번호를 입력해 Entry를 남기고, 아래에 모든 Entry가 최신 작성순으로 쌓인다. 각 Entry 카드에서 Entry Password를 입력해 Message를 수정하거나 삭제할 수 있다. 비밀번호가 맞지 않으면 그 카드 안에 "비밀번호가 일치하지 않습니다"가 표시되고 아무것도 바뀌지 않는다. 화면에는 개발자 이름(소재형)과 학번(202204225)이 항상 보인다. 배포는 Vercel, 데이터는 Neon Postgres에 저장한다.

## User Stories

1. As an Author, I want to 이름, 메시지, 비밀번호를 입력해 새 Entry를 남길 수 있다, so that 방명록에 흔적을 남길 수 있다.
2. As an Author, I want to 회원가입이나 로그인 없이 바로 글을 쓸 수 있다, so that 번거로움 없이 참여할 수 있다.
3. As an Author, I want to 작성 폼에서 "비밀번호를 잊으면 수정·삭제할 수 없다"는 안내를 본다, so that 비밀번호를 신중하게 정한다.
4. As an Author, I want to 이름이 비었거나 20자를 넘으면 오류 안내를 받는다, so that 무엇을 고쳐야 하는지 안다.
5. As an Author, I want to 메시지가 비었거나 공백뿐이거나 500자를 넘으면 오류 안내를 받는다, so that 잘못된 글이 저장되지 않는다.
6. As an Author, I want to 비밀번호가 4자 미만이거나 72자를 넘으면 오류 안내를 받는다, so that 안전한 길이로 정할 수 있다.
7. As an Author, I want to 앞뒤 공백이 자동으로 정리된다, so that 실수로 넣은 공백이 저장되지 않는다.
8. As an Author, I want to 작성에 성공하면 폼이 비워지고 내 글이 목록 맨 위에 보인다, so that 저장된 것을 바로 확인한다.
9. As an Author, I want to 작성 실패 시 입력한 내용이 그대로 유지된다, so that 다시 타이핑하지 않아도 된다.
10. As a Visitor, I want to 모든 Entry를 한 번에 볼 수 있다, so that 방명록 전체를 읽을 수 있다.
11. As a Visitor, I want to Entry가 최신 작성순으로 정렬되어 있다, so that 최근 글을 먼저 본다.
12. As a Visitor, I want to 각 Entry에서 이름, 메시지, 작성 시각을 본다, so that 누가 언제 남겼는지 안다.
13. As a Visitor, I want to 작성 시각이 한국 시간 `2026-09-30 14:32` 형식으로 보인다, so that 시각을 쉽게 읽는다.
14. As a Visitor, I want to 수정된 Entry에 작성 시각 뒤 괄호로 "(수정됨 수정시각)"이 보인다, so that 글이 수정되었음을 안다.
15. As a Visitor, I want to 메시지의 줄바꿈이 그대로 보인다, so that 여러 줄 글을 읽기 좋다.
16. As a Visitor, I want to 글이 아직 없을 때 비어 있음을 알리는 문구를 본다, so that 화면이 고장난 것으로 오해하지 않는다.
17. As a Visitor, I want to 모바일에서도 불편 없이 쓸 수 있다, so that 어떤 기기에서도 참여한다.
18. As a Visitor, I want to 개발자의 이름과 학번이 화면에 항상 보인다, so that 누가 만들었는지 알 수 있다.
19. As an Author, I want to 내 Entry 카드에서 수정 버튼을 눌러 비밀번호와 새 Message를 입력해 수정한다, so that 오타나 내용을 바로잡는다.
20. As an Author, I want to 비밀번호가 맞으면 Message가 바뀌고 "수정됨" 표시가 생긴다, so that 수정이 반영된 것을 확인한다.
21. As an Author, I want to 수정해도 이름과 작성 시각이 그대로다, so that 글의 정체성이 유지된다.
22. As an Author, I want to 비밀번호가 틀리면 수정이 거부되고 그 카드 안에 "비밀번호가 일치하지 않습니다"가 보인다, so that 왜 실패했는지 안다.
23. As an Author, I want to 비밀번호가 틀려도 입력 중인 새 Message가 유지된다, so that 비밀번호만 다시 입력할 수 있다.
24. As an Author, I want to 수정 Message도 1~500자 규칙을 적용받는다, so that 규칙이 일관된다.
25. As an Author, I want to 수정을 취소할 수 있다, so that 원래 글을 그대로 둘 수 있다.
26. As an Author, I want to 내 Entry 카드에서 삭제 버튼을 누르고 비밀번호를 입력해 삭제한다, so that 더 이상 남기고 싶지 않은 글을 지운다.
27. As an Author, I want to 삭제 전에 "정말 삭제할까요?" 확인 단계가 나온다, so that 실수로 지우지 않는다.
28. As an Author, I want to 비밀번호가 맞으면 Entry가 완전히 삭제되어 목록에서 사라진다, so that 내 글이 남지 않는다.
29. As an Author, I want to 비밀번호가 틀리면 삭제가 거부되고 그 카드 안에 "비밀번호가 일치하지 않습니다"가 보인다, so that 삭제되지 않았음을 안다.
30. As an Author, I want to 삭제를 취소할 수 있다, so that 마음이 바뀌면 그대로 둘 수 있다.
31. As an Author, I want to 다른 사람의 Entry는 그 사람의 비밀번호 없이는 고치거나 지울 수 없다, so that 내 글이 안전하다.
32. As a Visitor, I want to 다른 사람의 글 비밀번호나 해시가 어디에도 노출되지 않는다, so that 남의 글을 고칠 수 없다.
33. As a Visitor, I want to 다른 사람이 쓴 HTML이 스크립트로 실행되지 않고 글자 그대로 보인다, so that 안전하게 읽는다.
34. As an Author, I want to 요청이 진행 중일 때 버튼이 잠시 비활성화된다, so that 중복 제출을 피한다.
35. As an Author, I want to 이미 삭제된 글을 수정·삭제하려 하면 "글을 찾을 수 없습니다"라는 안내를 받는다, so that 상황을 이해한다.

## Implementation Decisions

- **Entry 도메인 모듈 (단일 테스트 seam)**: 입력 검증과 비밀번호 해시·검증을 한곳에 모은 순수 모듈. DB나 Next.js에 의존하지 않는다. 검증 규칙은 이름 trim 후 1~20자, 메시지 trim 후 1~500자(공백만 있으면 거부, 줄바꿈 허용), 비밀번호 4~72자. 검증 결과는 throw하지 않고 필드별 오류 메시지를 담은 값으로 돌려준다.
- **비밀번호 저장**: `bcryptjs`(cost 10)로 해시해 저장하고 평문은 저장·로그하지 않는다. 비밀번호 복구는 없다.
- **데이터 모델**: Entry 하나의 테이블. 식별자, 이름, 메시지, 비밀번호 해시, Created At, Edited At(수정 전에는 비어 있음). 이름과 메시지에는 DB 수준 길이 제약도 둔다. Created At 내림차순, 식별자 내림차순 정렬용 인덱스를 둔다.
- **DB 접근**: Neon 서버리스 드라이버로 SQL을 직접 작성한다. 모든 쿼리는 파라미터 바인딩을 쓴다. 마이그레이션은 SQL 파일로 관리하고 배포 전에 수동으로 적용한다.
- **서버 구조**: 작성·수정·삭제는 Server Actions. 폼은 `useActionState`로 연결하고, 검증 오류와 Password Mismatch는 throw하지 않고 반환값으로 돌려 카드 안에 표시한다. Server Action은 공개 POST 엔드포인트이므로 각 액션 안에서 입력 검증과 비밀번호 확인을 항상 다시 수행한다.
- **목록 조회**: 서버 컴포넌트가 전체 Entry를 최신순으로 DB에서 직접 읽는다. 페이지 나누기, 더 보기, 별도 조회 API는 없다. 캐싱을 켜지 않고 항상 동적 렌더링한다. 변경 성공 후 페이지를 다시 검증해 목록을 갱신한다.
- **응답 형태**: 화면에는 식별자, 이름, 메시지, Created At, Edited At만 전달한다. 비밀번호 해시는 어떤 응답·props에도 넣지 않는다.
- **시간 표시**: DB에는 UTC로 저장하고 화면은 Asia/Seoul로 서버에서 포맷한다. 수정된 Entry만 "(수정됨 수정시각)"을 붙인다. 상대 시간은 쓰지 않는다.
- **UI**: 한국어 단일 페이지. 작성 폼이 위, 목록이 아래. Tailwind로 모바일 우선 반응형, 다크모드는 시스템 설정을 따른다. 각 카드의 수정·삭제는 카드 안에서 비밀번호 입력란을 펼쳐 처리한다. 삭제는 "정말 삭제할까요?" 확인 단계를 거친다. 헤더 또는 푸터에 개발자 이름(소재형)과 학번(202204225)을 항상 표시한다.
- **Next.js 16 주의**: 요청 관련 API(`params`, `searchParams`)는 비동기다. 코드 작성 전 설치된 패키지의 문서를 확인한다.
- **배포**: GitHub(public) 저장소를 Vercel에 연결한다. GitHub 저장소, Vercel 프로젝트, Neon 프로젝트 이름은 모두 `guestbook-202204225`. `DATABASE_URL`은 서버 전용 환경변수다.

## Testing Decisions

- 좋은 테스트는 모듈의 외부에서 보이는 동작만 검증하고 구현 세부를 묻지 않는다.
- 테스트 seam은 **Entry 도메인 모듈 하나**다. Vitest 단위 테스트로 다음을 검증한다: 이름·메시지·비밀번호 길이 경계값(0/1/최대/최대+1), trim과 공백만 있는 입력 거부, 올바른 비밀번호는 통과하고 틀린 비밀번호는 거부, 해시가 평문과 다르다.
- Server Actions, DB 쿼리, UI는 자동 테스트하지 않는다. 배포 후 직접 작성·조회·수정·삭제와 비밀번호 불일치 안내를 확인한다.
- Prior art 없음(새 프로젝트).

## Out of Scope

회원가입과 로그인, 비밀번호 복구, 관리자 기능, 비밀번호 무차별 대입 제한(실패 횟수 잠금), IP 기반 스팸 제한, 페이지 나누기·더 보기, 마크다운과 이미지, 답글과 좋아요, 검색, 다국어, 실시간 갱신, 통합·E2E 자동 테스트.

## Further Notes

- 실기시험 제출물은 public GitHub 저장소 URL과 Vercel 배포 URL 두 가지다. 배포 URL에서 작성·조회·수정·삭제가 실제로 동작해야 한다.
- Vercel 빌드와 Neon 콜드 스타트 확인에 약 10분이 걸리므로 배포는 일찍 시작한다.
- 도메인 용어는 `GLOSSARY.md`를 따른다.
