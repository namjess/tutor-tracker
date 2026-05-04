# 과외 트래커 PWA — 셋업 가이드

폰에 앱처럼 설치하고, 클라우드(Supabase)로 모든 기기 자동 동기화하는 풀 셋업.

**소요 시간:** 처음 한 번 약 15분. 이후 추가 비용·관리 없음.

---

## 📁 이 폴더에 있는 파일

| 파일 | 역할 |
|---|---|
| `index.html` | 메인 앱. PWA + Supabase 통합. |
| `manifest.webmanifest` | PWA 매니페스트 (앱 이름, 아이콘, 시작 화면). |
| `sw.js` | Service Worker — 오프라인 지원·캐싱. |
| `icon.svg` | 앱 아이콘. |
| `supabase-schema.sql` | Supabase에 테이블 만들 SQL. |
| `README.md` | 이 가이드. |

---

## STEP 1. Supabase 프로젝트 만들기 (5분)

### 1.1. 가입·프로젝트 생성
1. <https://supabase.com> 접속 → **Start your project** → GitHub 계정으로 로그인
2. **New project** 클릭
3. 입력값:
   - **Name**: `tutor-tracker` (자유)
   - **Database Password**: 강한 비밀번호 생성 후 메모 (DB 직접 접속 시 사용. 평소엔 필요 X)
   - **Region**: `Northeast Asia (Seoul)` 또는 `Northeast Asia (Tokyo)` (한국에서 가장 빠름)
   - **Pricing Plan**: Free
4. **Create new project** → 1~2분 대기 (프로비저닝)

### 1.2. 테이블·정책 만들기
1. 좌측 메뉴 → **SQL Editor** → **New query**
2. 이 폴더의 `supabase-schema.sql` 내용 전체 복사 → 붙여넣기 → **Run**
3. 성공 메시지 확인

### 1.3. API 키 가져오기
1. 좌측 메뉴 → **Settings** (톱니) → **API**
2. 두 값 복사해 메모:
   - **Project URL** (예: `https://abcdefghij.supabase.co`)
   - **anon public** key (긴 문자열, 공개해도 안전 — RLS가 보호)

### 1.4. 이메일 인증 설정
1. **Authentication** → **Providers** → **Email**
2. **Enable Email provider** ✅ (기본값)
3. **Confirm email** 옵션은 OFF로 둬도 됨 (매직 링크라 이미 검증됨)

### 1.5. 리다이렉트 URL 추가 (GitHub Pages 주소를 미리 알려둠)
1. **Authentication** → **URL Configuration**
2. **Site URL**: `https://<github사용자명>.github.io/tutor-tracker/` (STEP 3에서 만들 주소)
3. **Redirect URLs** 섹션에 추가:
   - `https://<github사용자명>.github.io/tutor-tracker/`
   - `http://localhost:*` (로컬 테스트용, 선택)
4. **Save**

---

## STEP 2. `index.html`에 Supabase 키 입력

1. 이 폴더의 `index.html` 파일을 메모장·VS Code 등으로 열기
2. 상단 가까이 (50번째 줄 부근) 이 부분 찾기:
   ```js
   const SUPABASE_URL = "";
   const SUPABASE_ANON_KEY = "";
   ```
3. STEP 1.3에서 복사한 값 입력:
   ```js
   const SUPABASE_URL = "https://abcdefghij.supabase.co";
   const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIs...긴문자열";
   ```
4. 저장

> **⚠️ 보안 메모**: anon key는 공개돼도 안전. RLS(Row Level Security)가 본인 데이터만 접근하게 막아줌. 절대 노출되면 안 되는 건 **service_role** key (Supabase 대시보드에서만 사용).

---

## STEP 3. GitHub Pages에 올리기 (5분)

### 3.1. GitHub 계정·저장소 만들기
1. <https://github.com> 가입 (이미 있으면 로그인)
2. 우측 상단 `+` → **New repository**
3. **Repository name**: `tutor-tracker`
4. **Public** 선택 (Free 계정의 GitHub Pages는 public만 가능. anon key가 공개돼도 안전하니 OK)
5. **Create repository**

### 3.2. 파일 업로드
1. 저장소 페이지에서 **uploading an existing file** 링크 클릭 (또는 **Add file** → **Upload files**)
2. 이 폴더 안의 **모든 6개 파일** (index.html, manifest.webmanifest, sw.js, icon.svg, supabase-schema.sql, README.md) 끌어다 놓기
3. **Commit changes**

### 3.3. GitHub Pages 활성화
1. 저장소 → **Settings** → 좌측 **Pages**
2. **Source**: `Deploy from a branch`
3. **Branch**: `main` / `/ (root)` → **Save**
4. 1~2분 후 페이지 상단에 URL 표시: `https://<사용자명>.github.io/tutor-tracker/`
5. 그 URL을 클릭해서 열어보기 → 앱이 뜨면 성공

### 3.4. STEP 1.5의 Supabase 리다이렉트 URL 확인
실제 GitHub Pages 주소가 STEP 1.5에서 입력한 것과 같은지 다시 확인. 다르면 Supabase 대시보드에서 수정.

---

## STEP 4. 폰에 앱 설치 (1분)

### iOS (Safari)
1. Safari로 GitHub Pages URL 열기
2. 하단 **공유 버튼** (□↑) → **홈 화면에 추가**
3. 이름 확인 → **추가**
4. 홈 화면에 "과외" 아이콘 생김 → 탭하면 풀스크린 앱 모드

### Android (Chrome)
1. Chrome으로 URL 열기
2. 자동으로 하단에 "홈 화면에 추가" 배너 → **설치**
3. 또는 메뉴 (︙) → **앱 설치**

---

## STEP 5. 첫 로그인

1. 앱 열기
2. 상단 검은 바 → **클라우드 로그인**
3. 이메일 입력 (예: `namjess@gmail.com`)
4. **매직 링크 보내기**
5. 메일함 가서 **Confirm your signup** 또는 **Log in to ...** 링크 클릭
6. 자동으로 앱이 다시 열리고 로그인 완료
7. 상단 바가 **녹색 ☁️ 동기화됨**으로 변경

이제 데스크톱·폰 어디서든 같은 이메일로 로그인하면 데이터 자동 동기화.

---

## 🔄 Cowork 아티팩트와의 관계

| 사용 시나리오 | 어디서? |
|---|---|
| 평소 청구·발급 관리 | **폰 PWA** |
| 데스크톱에서 대량 입력·세팅 | **PWA를 데스크톱 브라우저로** |
| 가끔 백업·디버깅·기능 변경 요청 | **Cowork 아티팩트** (별도 localStorage) |

> Cowork 아티팩트는 보안 정책상 외부 클라우드(Supabase)에 연결할 수 없어요. 그래서 PWA가 메인이 됨. Cowork에서 데이터를 볼 일이 있으면 PWA에서 [JSON 백업] → Cowork에서 [JSON 복원].

---

## ⚙️ 자주 묻는 것

**Q. 비용은?**
- Supabase Free: 500MB DB, 무제한 API 호출. 1인 사용자에겐 평생 무료 수준.
- GitHub Pages Free: public 저장소면 무료.
- 도메인·서버 비용 0원.

**Q. 데이터 안전해?**
- Supabase는 Postgres 기반 + 자동 백업. RLS로 본인 데이터만 접근.
- 추가 안심: 가끔 PWA에서 [JSON 백업 다운로드] → 클라우드 드라이브 저장.

**Q. 오프라인에서도 되나?**
- 한 번 열어본 후엔 Service Worker가 캐시해서 오프라인에서도 작동. 변경사항은 다음 온라인 시 자동 동기화 (단, 로그인 세션 유효한 한).

**Q. 다른 사람이 내 URL을 알면 데이터 보임?**
- 안 보임. 로그인 안 하면 빈 앱만 보이고, 로그인해도 본인 데이터만 보여요.

**Q. 키를 잃어버렸어요**
- Supabase 대시보드에서 언제든 다시 확인 가능 (Settings > API).

**Q. 기능 업데이트하려면?**
- 이 폴더 파일을 수정 → GitHub 저장소에 다시 업로드 (또는 GitHub Desktop·git 사용) → 자동 배포. 폰 PWA는 SW가 새 버전 감지해 자동 업데이트.

---

## 🛟 문제 해결

| 증상 | 원인·해결 |
|---|---|
| "클라우드 미설정" 알림 | `index.html`의 SUPABASE_URL/KEY 입력 확인 |
| 매직 링크 클릭해도 로그인 안 됨 | Supabase Auth > URL Configuration에 GitHub Pages URL 등록 확인 |
| 동기화 실패 빨간 바 | 인터넷 연결 또는 Supabase 무료 한도 (가능성 낮음) — 로컬은 항상 저장됨 |
| 앱 아이콘이 폰에 안 생김 | Safari/Chrome으로 한 번 페이지 끝까지 로드 후 "홈 화면에 추가" 다시 시도 |
| 데이터가 갑자기 안 보임 | 로그아웃 상태일 가능성. 상단 바에서 다시 로그인 |

---

## 🎉 끝

문제 있거나 기능 추가 원하면 다시 Cowork에서 요청하면 됨.
