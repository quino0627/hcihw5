# 차량 대여 서비스

Next.js 13 App Router를 사용한 차량 대여 서비스 웹 애플리케이션입니다.

## 주요 기능

- 차량 목록 조회 및 상세 정보 확인
- 차량 예약 및 관리
- 실시간 차량 상태 확인
- AI 기반 차량 문의 응답
- 스마트키 기능 (도어 잠금/해제)

## 기술 스택

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (데이터베이스, 인증)
- **AI**: OpenAI API
- **Deployment**: Vercel

## 시작하기

1. 저장소 클론

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. 의존성 설치

```bash
npm install
```

3. 환경 변수 설정
   `.env.local` 파일을 생성하고 다음 변수들을 설정:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
```

4. 개발 서버 실행

```bash
npm run dev
```

## 환경 변수

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 익명 인증 키
- `OPENAI_API_KEY`: OpenAI API 키

## 데이터베이스 스키마

### Vehicles 테이블

- id: UUID (PK)
- model: String
- manufacturer: String
- year: Number
- category: String
- location: String
- status: String
- features: JSON
- image_url: String

### Reservations 테이블

- id: UUID (PK)
- vehicle_id: UUID (FK)
- user_id: UUID (FK)
- start_time: Timestamp
- duration: Number
- status: String
- created_at: Timestamp
