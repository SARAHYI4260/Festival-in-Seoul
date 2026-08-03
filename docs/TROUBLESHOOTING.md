# 🛠️ TROUBLESHOOTING LOG - 서울시 페스티벌 지도 (Festival in Seoul)

> 프로젝트 개발 과정에서 발생한 핵심 기술적 이슈, 원인 분석 및 해결 과정을 체계적으로 기록한 트러블슈팅 문서입니다.

---

## 📌 [Issue 01] Git 사용자 설정 명령 파라미터 누락 오류

### 1. 문제 상황 (Problem)

- `git config --global SARAHYI4260` 명령 실행 시 사용자 정보 설정이 실패하며 에러 출력.
  > `error: key does not contain a section: SARAHYI4260`

### 2. 원인 분석 (Cause)

- Git global 설정 시 설정 키 명칭(`user.name` 또는 `user.email`)이 빠진 상태에서 값만 입력되어 Git CLI 인식 오류 발생.

### 3. 해결 방법 (Solution)

- `user.name` 및 `user.email` 구문을 명확히 작성하여 올바른 키-값 포맷으로 설정 재실행.

```bash
git config --global user.name "SARAHYI4260"
git config --global user.email "본인이메일@example.com"

📌 [Issue 02] Kakao Map API Uncaught ReferenceError: kakao is not defined
1. 문제 상황 (Problem)
웹페이지 로드 시 지도가 출력되지 않고 브라우저 콘솔에 ReferenceError: kakao is not defined 발생.

2. 원인 분석 (Cause)
카카오 지도 SDK 스크립트가 네트워크를 통해 로드되기 전에 main.js 내 지도 객체 생성 로직이 먼저 실행되는 비동기 로딩 타이밍 문제.

3. 해결 방법 (Solution)
Script 태그 호출 시 &autoload=false 파라미터를 명시.

main.js 내에서 SDK 로드가 완료된 후 지도 생성 로직이 실행되도록 kakao.maps.load() 콜백 구문 적용.

JavaScript
   function initKakaoMap() {
      if (typeof kakao === 'undefined' || !kakao.maps) {
         setTimeout(initKakaoMap, 100);
         return;
      }
      kakao.maps.load(function () {
         // 지도 생성 및 마커 표시 로직 실행
      });
   }
   window.addEventListener('DOMContentLoaded', initKakaoMap);

📌 [Issue 03] 공공 API 네트워크 타임아웃 및 401 Unauthorized 오류
1. 문제 상황 (Problem)
브라우저 콘솔에 net::ERR_CONNECTION_TIMED_OUT 및 401 Unauthorized 에러 연속 발생.

2. 원인 분석 (Cause)
요청 URL에 특수 포트 번호(:25401)가 포함되어 외부 방화벽에 의해 통신 차단.

Template Literal 작성 시 serviceKey 변수 바로 앞에 $ 기호가 중복 포함되어(serviceKey=$c680e7...) API 키 인증 실패.

3. 해결 방법 (Solution)
기관의 표준 HTTPS 엔드포인트 주소(https://apis.data.go.kr/...)로 URL 변경.

API_KEY 변수 연결 시 중복된 $ 기호를 제거하고 순수 Decoding Key만 파라미터로 전달.

📌 [Issue 04] 불필요한 Request Parameter로 인한 INVALID_REQUEST_PARAMETER_ERROR
1. 문제 상황 (Problem)
API 호출 시 INVALID_REQUEST_PARAMETER_ERROR(listYN) 메시지 및 TypeError: Cannot read properties of undefined (reading 'body') 발생.

2. 원인 분석 (Cause)
API 최신 규격에서 미지원하는 listYN=Y 파라미터 포함으로 서버가 예외 응답을 보냈고, 이로 인해 JSON 구조 내 body 객체가 생성되지 않아 접근 에러 발생.

3. 해결 방법 (Solution)
요청 URL에서 미지원 파라미터 listYN 제거.

데이터 참조 전 검증 조건문(if (data.response && data.response.body && data.response.body.items))을 작성하여 예외 처리 강화.

📌 [Issue 05] Spring Boot 패키지 경로 자동 바인딩 불일치 (com.festival.seoul -> jar)
1. 문제 상황 (Problem)
Spring Initializr에서 Group을 com.festival, Artifact를 seoul로 지정했으나 생성된 프로젝트 경로가 src/main/java/jar/로 자동 생성됨.

2. 원인 분석 (Cause)
초기 설정 시 Packaging 옵션(Jar) 지정으로 인해 메인 루트 패키지명이 jar로 자동 바인딩되는 현상 발생.

3. 해결 방법 (Solution)
기존 자동 생성된 jar 패키지 경로 구조를 그대로 활용하고, 하위 클래스 상단에 package jar;를 명시하여 빌드 및 실행 안정성 확보.

📌 [Issue 06] Gradle 버전 호환성 오류로 인한 H2 Console 접속 불가 (404 Error)
1. 문제 상황 (Problem)
application.yml에 H2 콘솔 활성화 설정을 추가했으나 /h2-console 접속 시 404 Error 발생 및 Gradle Sync 실패.

2. 원인 분석 (Cause)
로컬 Gradle 버전과 Spring Boot 3.2.x 및 Dependency Management 플러그인 버전 간 호환성 불일치로 내장 웹 콘솔 매핑 실패.

3. 해결 방법 (Solution)
build.gradle 내 검증된 버전을 명시하고 Gradle Sync 재실행하여 정상 동작 확인.

Groovy
   plugins {
      id 'java'
      id 'org.springframework.boot' version '3.2.5'
      id 'io.spring.dependency-management' version '1.1.6'
   }

📌 [Issue 07] 메인 패키지 위치 이탈로 인한 JPA Entity 미인식 및 테이블 미생성
1. 문제 상황 (Problem)
Festival.java Entity 클래스를 작성하고 서버를 실행했으나 H2 데이터베이스 내 FESTIVALS 테이블이 자동 생성되지 않음.

2. 원인 분석 (Cause)
domain 패키지가 메인 실행 클래스(JarApplication.java)가 위치한 Jar 패키지의 바깥 상위 위치에 생성되어 Spring Boot의 Component Scan 범위에서 제외됨.

3. 해결 방법 (Solution)
domain 폴더를 메인 패키지 하위(src/main/java/Jar/domain)로 이동하고 package Jar.domain;으로 변경하여 Entity 스캔에 정상 포함시킴.

📌 [Issue 08] 백엔드 REST API 연동 후 카카오 지도 마커 미출력 (좌표 속성명 불일치)
1. 문제 상황 (Problem)
백엔드 REST API(http://localhost:8080/api/festivals)로 엔드포인트를 변경한 후, 지도는 표시되나 마커가 찍히지 않음 (생성된 마커 개수: 0개).

2. 원인 분석 (Cause)
외부 공공 API 직접 호출 시 속성명(mapy, mapx)과 백엔드 DB Entity 속성명(lat, lot)이 달라 자바스크립트에서 undefined 처리됨.

3. 해결 방법 (Solution)
백엔드 DB 속성명(lat, lot)과 기존 공공 API 속성명을 함께 대응하는 동적 파싱 로직 적용.

JavaScript
   var lat = parseFloat(item.lat || item.latitude || item.mapy);
   var lng = parseFloat(item.lot || item.longitude || item.mapx);

   if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      var markerPosition = new kakao.maps.LatLng(lat, lng);
      var marker = new kakao.maps.Marker({ position: markerPosition });
      marker.setMap(map);
   }

📌 [Issue 09] In-Memory DB 휘발 및 검색 필터링 매칭 실패
1. 문제 상황 (Problem)
백엔드 서버 재시작 시 H2 DB 데이터가 휘발되어 프론트엔드 데이터 조회 결과가 빈 배열([])로 반환됨.

프론트엔드에서 자치구 드롭다운을 선택하고 검색해도 백엔드 DB 조회가 정상 수행되지 않음.

2. 원인 분석 (Cause)
H2 In-Memory DB 특성상 서버 종료 시 데이터가 초기화되나 수동 적재 API(/api/festivals/save)에 의존하는 구조였음.

HTML <option>의 value가 영문(mapo, jongno)으로 설정되어 DB 내 한글 장소명("마포구", "종로구")과 JPQL 검색 조건이 매칭되지 않음.

3. 해결 방법 (Solution)
@PostConstruct 자동 수집 구현: FestivalService 내 초기화 메서드를 추가하여 서버 가동 시 DB가 비어있으면 공공 API 데이터를 자동 수집하도록 설정.

HTML DOM Value 한글화: 드롭다운 <option>의 value를 DB 규격과 동일한 한글 자치구명("마포구", "종로구")으로 수정하여 검색 기능 정상화.

Java
   @PostConstruct
   public void init() {
      if (festivalRepository.count() == 0) {
         fetchAndSaveFestivals();
         System.out.println("🚀 [자동 실행] 서버 구동 시 초기 데이터 수집 완료!");
      }
   }
```
