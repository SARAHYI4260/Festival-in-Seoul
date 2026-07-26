# 📅 DAILY LOG - 서울시 페스티벌 지도 (Festival in Seoul)

---

## 🗓️ (Day 1) - 프로젝트 환경 구축 & 1주차 프론트엔드 UI 레이아웃

### 🎯 금일 목표

- [x] 프론트엔드 개발 환경 설정 (VS Code 확장 프로그램 설치 및 폴더 구조화)
- [x] HTML5 / CSS3 (Grid, Flexbox)를 활용한 서울 페스티벌 카드 UI 화면 레이아웃 구성
- [x] Git/GitHub 연동 및 초기 저장소 구축 (`https://github.com/SARAHYI4260/Festival-in-Seoul`)

---

### 📝 주요 작업 내용

#### 1. 디렉토리 구조 설계 (관심사 분리)

포트폴리오 표준에 맞춰 파일 및 폴더 구조를 체계적으로 정돈함.

```text
Festival-in-Seoul/
└── frontend/
    ├── css/
    │   └── style.css       # CSS 스타일 분리
    ├── images/             # 이미지 자원 관리
    ├── js/                 # JS 파일 준비 (2주차 대비)
    │   └── main.js
    ├── .gitignore          # OS 및 불필요 파일 제외 설정
    ├── index.html          # 메인 HTML
    └── README.md           # 프로젝트 소개 문서
```

#### 2. 프로젝트 스코프 정의 (전국 -> 서울 지역 한정 MVP)

초기 전국 대상 데이터 구조에서, 핵심 기능 구현 및 밀도 높은 완성을 위해 '서울시 25개 자치구' 한정 서비스로 스코프를 축소함.

주요 UI 요소:

    - Header: 서울 자치구 선택 드롭다운(<select>) 및 키워드 검색창

    - Main: CSS Grid 기반의 반응형 축제 카드 컴포넌트 (마포구, 영등포구,종로구 샘플 적용)

#### 3. 버전 관리 (Git & GitHub)

Local Repository 생성 (git init) 및 Remote Repository 연결

커밋 컨밴션 (feat:, docs: )을 준수하여 첫 릴리즈 커밋 작성 및 main 브랜치 업로드 완료

💡 오늘의 회고 & 배운 점
범위 설정의 중요성: 무작정 커다란 전국 서비스를 기획하기보다 MVP(최소 기능 제품) 단위를 확실하게 정의하고 서울 지역에 집중하기로 결정한 점이 향후 백엔드 API 연동 시 작업 효율을 높여줄 것 같다.

# 📅 개발 일지 (Daily Development Log)

---

## 📌 (Day2) 카카오 지도 API 연동 및 웹 화면 출력

- **작성일**: 2026-07-26
- **주요 목표**: 웹 프론트엔드 화면에 카카오 지도 API를 연동하여 서울시 지도를 렌더링하고 기본 마커(서울시청 좌표) 표시하기

### 🛠️ 주요 진행 작업 (Tasks)

1. **카카오 개발자 센터 설정**
   - `Festival-in-Seoul` 애플리케이션 생성 및 `JavaScript 키` 발급.
   - Live Server 로컬 개발 환경 도메인 등록 (`http://127.0.0.1:5500`, `http://localhost:5500`).
   - 카카오맵 제품 서비스 **[활성화 설정] ON** 변경.

2. **HTML / CSS 화면 구조 개편**
   - `index.html` 내 독립적인 지도 영역 (`<div id="map">`) 추가 및 높이(`height: 400px;`) 설정.
   - 깨지는 외부 더미 이미지를 신뢰 가능한 CDN 주소(Unsplash)로 교체하고 HTML 태그 오타 정돈.

3. **JavaScript SDK 및 로직 작성**
   - HTML 하단 스크립트 연결 시 `autoload=false` 파라미터 적용.
   - `main.js` 파일에 SDK 및 DOM 완료 대기 함수(`initKakaoMap`) 작성 후 서울시청 좌표(`37.5665, 126.978`) 중심 지도 생성 및 마커 추가.

### 💡 오늘의 배운 점 & 회고 (Retrospective)

- **외부 API 활성화 및 권한 관리**: API 키와 도메인이 정상이더라도 서비스 제공자(카카오) 콘솔 상의 '제품 활성화 스위치'가 꺼져 있으면 접근이 차단(`403 Forbidden`)된다는 것을 체득함.
- **비동기 스크립트 로딩 관리**: 자바스크립트 파일이 실행되는 시점에 카카오 라이브러리가 완전히 준비되지 않을 수 있어, 안전한 로딩 대기 로직(`kakao.maps.load()`)이 필수적임을 이해함.

---

## 📅 (Day3) 공공데이터 API 연동 및 카카오 지도 다중 마커 표시

- **작업 일자**: 2026-07-26 (3주차)
- **주요 목표**: 공공데이터포털(data.go.kr) 오픈 API 연동 ➔ 데이터 파싱 ➔ Kakao Map 위 다중 마커 자동 렌더링

### 📝 진행 내용 요약

1. **공공데이터포털 오픈 API 활용 신청 및 키 발급**
   - API명: `한국관광공사_국문 관광정보 서비스` (`searchFestival2` - 축제/행사 조회)
   - 브라우저 JavaScript 환경 특성을 고려하여 **Decoding Key**를 활용하도록 환경 구성.

2. **JavaScript `fetch()` 기반 비동기 데이터 통신 구현**
   - 오픈 API 엔드포인트 호출을 통해 서울 지역(`areaCode=1`)의 축제 정보 JSON 데이터를 정상 수신.
   - Response 데이터 구조(`data.response.body.items.item`) 분석 및 예외 처리 로직 추가.

3. **Kakao Map 다중 마커 동적 생성**
   - 수신된 데이터 배열을 `forEach` 반복문으로 순회하며 각 축제의 좌표값(`mapy`: 위도, `mapx`: 경도) 추출.
   - `kakao.maps.LatLng` 좌표 객체를 생성하고, `kakao.maps.Marker`를 통해 지도 위에 다중 마커 실시간 출력 완료.

4. **Git 형상 관리 & 커밋 업로드**
   - `git add .` 및 `git commit -m "feat: 3주차 공공데이터 API 연동 및 카카오 지도 마커 표시 완료"`
   - GitHub Remote Repository (`main` 브랜치) 푸시 완료.

---

### 💡 오늘 한 일

- **백엔드 개발 환경 구축**
  - Java 17(JDK) 설치 및 환경변수 확인
  - 백엔드 전용 IDE인 **IntelliJ IDEA Community Edition** 설치 및 세팅
- **Spring Boot 프로젝트 생성 (start.spring.io)**
  - Gradle - Groovy 기반, Java 17, Spring Boot 버전 설정
  - 필수 의존성 라이브러리 추가: `Spring Web`, `Lombok`
- **첫 번째 REST API 구축 및 서버 가동 테스트**
  - `@RestController` 및 `@GetMapping("/api/test")`를 이용한 `TestController` 작성
  - 내장 Tomcat 서버 실행(8080 포트) 및 브라우저(`http://localhost:8080/api/test`) 정상 응답 확인
- **Git 상태 관리 및 GitHub Push**
  - 백엔드 작업 내역 커밋: `feat: 4주차 Spring Boot 백엔드 환경 구축 및 테스트 API 완료`

### 🔍 배운 점 & 느낀 점

- Spring Initializr를 통해 백엔드 서버의 기본 뼈대를 수초 만에 구성하는 스프링 부트의 생산성을 체감함.
- 프로젝트 초기 설정 시 Packaging(`Jar`) 방식 선택에 따른 루트 패키지 경로 자동 생성 원리를 이해함.
- 프론트엔드 중심 구조에서 백엔드 서버를 추가함으로써 프로젝트 전체 구조(프론트엔드 + 백엔드)를 대규모 포트폴리오 형태로 고도화함.

---

## 📅 (Day5) 백엔드 공공 API 수집 및 DB 저장 파이프라인 구축

### 📌 학습 및 진행 목표

- Spring Boot 서버에서 내장 인메모리 데이터베이스(H2 DB) 연동 및 설정
- JPA Entity 및 Repository를 활용한 축제 데이터베이스 테이블 구조 설계
- 자바 백엔드 서버가 직접 외부 공공 API(서울시 문화행사 정보)를 수집하여 DB에 적재하는 파이프라인 구축
- DB에 저장된 데이터를 JSON 형태 목록으로 제공하는 REST API 엔드포인트 구현

---

### 🛠️ 주요 작업 내용

1. **H2 Database 환경 세팅 (`application.yml`)**
   - H2 인메모리 DB 연결 설정 (`jdbc:h2:mem:testdb`)
   - 웹 브라우저 접속용 `/h2-console` 웹 콘솔 활성화

2. **Entity & Repository 클래스 작성 (`Jar/domain/`)**
   - `Festival.java`: 축제명(`title`), 장소(`place`), 시작/종료일(`startDate`, `endDate`), 이용대상(`useTrgt`), 요금여부(`isFree`), 위도/경도(`lat`, `lot`) 필드를 정의한 JPA Entity 작성
   - `FestivalRepository.java`: `JpaRepository<Festival, Long>`를 상속받아 데이터베이스 조작 창구 마련

3. **공공 API 데이터 수집 및 적재 서비스 로직 구현 (`Jar/service/FestivalService.java`)**
   - `RestTemplate`을 활용해 서울시 공공 API 서버로 HTTP GET 요청 전송
   - `ObjectMapper` 및 `JsonNode`를 활용하여 JSON 응답을 파싱하고 `Festival` 객체 리스트로 데이터 가공
   - `festivalRepository.saveAll()`을 활용해 수집된 축제 데이터를 H2 DB에 일괄 저장

4. **REST API 컨트롤러 연동 (`Jar/controller/FestivalApiController.java`)**
   - `GET /api/festivals/save`: 외부 API를 호출해 DB에 데이터를 수집/저장하는 엔드포인트
   - `GET /api/festivals`: DB에 저장된 축제 목록 전체를 JSON 리스트 형태로 반환하는 엔드포인트

---

### 📊 검증 및 최종 결과

- `GET /api/festivals/save` 실행 시 `성공적으로 5개의 축제 데이터를 DB에 저장했습니다!` 응답 확인
- H2 Console (`http://localhost:8080/h2-console`) 접속 후 `SELECT * FROM FESTIVALS;` 실행 시 레코드 정상 적재 확인
- `GET /api/festivals` 접속 시 저장된 축제 데이터 리스트가 규격화된 JSON 배열 형태로 정상 출력 확인

---
