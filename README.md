물론이죠. 지금까지 진행한 내용을 바탕으로 다른 사람들이 이해하기 쉽도록 `README.md` 파일을 작성해 드릴게요. 아래 내용을 복사해서 `README.md` 파일에 붙여넣으시면 됩니다.

---

# Next.js & Supabase 사진 갤러리

이 프로젝트는 **Next.js**와 **Supabase**를 사용하여 이미지 파일을 업로드하고, 조회하며, 삭제하는 기능을 연습하기 위해 만들어졌습니다.

## 주요 기술 스택

- **프레임워크**: Next.js (App Router)
- **언어**: TypeScript
- **백엔드 & 데이터베이스**: Supabase (Database, Storage)
- **데이터 페칭**: TanStack Query (React Query)
- **서버 상태 관리**: Next.js Server Actions
- **스타일링**: Tailwind CSS
- **패키지 매니저**: pnpm

## 프로젝트 설정 및 실행

1.  **.env.local 파일 생성**
    프로젝트 최상위 경로에 `.env.local` 파일을 생성하고 Supabase 프로젝트의 URL과 Anon Key를 추가합니다.

    ```env
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

2.  **의존성 패키지 설치**

    ```bash
    pnpm install
    ```

3.  **Supabase 타입 생성**
    Supabase 테이블 스키마를 기반으로 TypeScript 타입을 생성합니다.

    ```bash
    pnpm run gen:types
    ```

4.  **개발 서버 실행**

    ```bash
    pnpm dev
    ```

## Supabase 설정

이 프로젝트를 실행하려면 Supabase 백엔드에 다음과 같은 설정이 필요합니다.

#### 1\. `photos` 테이블 생성

SQL Editor에서 아래 쿼리를 실행하여 `photos` 테이블을 생성합니다.

```sql
CREATE TABLE public.photos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  caption text NULL,
  image_url text NOT NULL,
  CONSTRAINT photos_pkey PRIMARY KEY (id)
);
```

#### 2\. 스토리지 버킷 생성

- Supabase 대시보드의 **Storage** 메뉴로 이동합니다.
- `photos` 이름으로 **Public bucket**을 생성합니다.

#### 3\. 스토리지 정책 설정

SQL Editor에서 아래 쿼리를 실행하여 스토리지 접근 권한을 설정합니다.

```sql
-- 'photos' 버킷에 대한 SELECT(읽기) 권한을 모두에게 부여합니다.
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'photos');

-- 'photos' 버킷에 대한 INSERT(업로드) 권한을 모두에게 부여합니다.
CREATE POLICY "Public Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'photos');

-- 'photos' 버킷에 대한 DELETE(삭제) 권한을 모두에게 부여합니다.
CREATE POLICY "Public Delete Access"
ON storage.objects FOR DELETE
USING (bucket_id = 'photos');
```

## 주요 기능

### 1\. 사진 업로드

- 사용자가 캡션과 함께 이미지 파일을 선택합니다.
- 선택된 파일의 이름은 URL 친화적으로 \*\*정제(Sanitize)\*\*된 후 Supabase 스토리지에 업로드됩니다.
- 업로드가 완료되면 해당 파일의 공개 URL을 받아옵니다.
- 파일 URL과 캡션 정보는 **Server Action**을 통해 `photos` 데이터베이스 테이블에 저장됩니다.

### 2\. 사진 목록 조회

- Next.js의 **서버 컴포넌트**에서 `getPhotosAction`을 호출하여 페이지 렌더링 시점에 서버에서 직접 사진 목록 데이터를 조회합니다.
- 조회된 데이터는 **클라이언트 컴포넌트**인 `<PhotoGrid />`에 `props`로 전달되어 화면에 표시됩니다.

### 3\. 사진 삭제

- 각 사진 카드에 있는 삭제 버튼을 클릭하면 해당 사진의 `id`를 인자로 받는 **Server Action**이 호출됩니다.
- Server Action은 Supabase 데이터베이스에서 해당 레코드를 삭제합니다.
- 삭제 성공 시 `revalidatePath`를 통해 페이지를 새로고침하여 변경사항을 화면에 즉시 반영합니다.
