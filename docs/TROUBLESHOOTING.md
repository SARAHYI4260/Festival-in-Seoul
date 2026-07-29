# 🛠️ TROUBLESHOOTING LOG - Festival in Seoul

## 📌 Issue #1: `git config` 입력 시 명령 파라미터 누락 에러

### 1. 문제 상황 (Issue)

`git config --global SARAHYI4260` 명령 실행 시 다음과 같은 오류 발생하며 사용자 정보 설정 실패.

> `error: key does not contain a section: SARAHYI4260`

### 2. 원인 분석 (Cause)

Git global 설정 시 키 이름(`user.name` 또는 `user.email`)이 빠진 채 설정값만 입력되어 Git CLI가 인식하지 못함.

### 3. 해결 방법 (Solution)

`user.name` 구문을 명확하게 포함하여 올바른 키-값 구조로 재입력하여 해결.

````bash
git config --global user.name "SARAHYI4260"
git config --global user.email "본인이메일@example.com"

## 🚀 생성 및 Push 명령어 (터미널용)

두 파일을 모두 작성하여 저장하신 후, VS Code 터미널에서 아래 명령어 3줄을 순서대로 실행하시면 GitHub에 정상적으로 업로드됩니다.

```bash
git add .
git commit -m "docs: DAILY_LOG 및 TROUBLESHOOTING 문서 추가"
git push

````

# 🛠️ 트러블슈팅 노트 (Troubleshooting Log)

---

## 📌 [이슈 01] Kakao Map API `Uncaught ReferenceError: kakao is not defined` 에러

### 1. 문제 상황 (Problem)

- 웹페이지 로드 시 브라우저 개발자 도구(F12) 콘솔창에 `kakao is not defined` 에러가 발생하며 지도가 렌더링되지 않음.

### 2. 원인 분석 (Cause)

- 카카오 지도 SDK 스크립트가 네트워크를 통해 완전히 로드되어 `kakao` 글로벌 객체가 생성되기 전에 `main.js` 파일의 지도 생성 코드가 먼저 실행되어 발생한 비동기 로딩 타이밍 이슈.

### 3. 해결 방법 (Solution)

- HTML 스크립트 태그에 `&autoload=false` 파라미터를 명시.
- `main.js` 내부에서 SDK 및 DOM 로드가 완전히 완료되었는지 확인한 후 실행되도록 대기 로직 및 `kakao.maps.load()` 콜백 함수 작성.

```javascript
function initKakaoMap() {
  if (typeof kakao === "undefined" || !kakao.maps) {
    setTimeout(initKakaoMap, 100);
    return;
  }
  kakao.maps.load(function () {
    // 지도 생성 및 마커 표시 로직
  });
}
window.addEventListener("DOMContentLoaded", initKakaoMap);
```

# 🛠️ TROUBLESHOOTING (트러블슈팅 노트)

---

## 📌 [이슈 01] 네트워크 타임아웃 및 Fetch 실패 (`ERR_CONNECTION_TIMED_OUT`)

### 1. 문제 상황 (Problem)

- 브라우저 콘솔에 `net::ERR_CONNECTION_TIMED_OUT` 및 `TypeError: Failed to fetch` 오류가 발생하며 공공데이터를 불러오지 못함.

### 2. 원인 분석 (Cause)

- 요청 URL에 특수 포트 번호(`:25401`)가 포함되어 있거나, 네트워크 방화벽/보안 소프트웨어로 인해 해당 포트 통신이 차단됨.

### 3. 해결 방법 (Solution)

- 공공데이터포털 및 기관의 표준 HTTPS 엔드포인트 주소(`https://apis.data.go.kr/...`)로 요청 URL을 변경하여 정상 연결 확보.

---

## 📌 [이슈 02] Response 데이터 파싱 에러 (`SyntaxError: Unexpected token '<'`)

### 1. 문제 상황 (Problem)

- `response.json()` 파싱 시 `SyntaxError: Unexpected token '<', "<RESULT><C"... is not valid JSON` 에러 발생.

### 2. 원인 분석 (Cause)

- API 서버에 보낸 Request URL 규격이 해당 기관 API 사양과 맞지 않아, JSON 응답이 아닌 XML 형태의 에러 메세지(`<RESULT>...`)가 반환됨.

### 3. 해결 방법 (Solution)

- 발급받은 API 서비스(한국관광공사 국문 관광정보 API)의 규격 문서에 맞춰 Endpoint 경로 및 쿼리 파라미터를 보정하여 정상 JSON 응답 수신.

---

## 📌 [이슈 03] API 인증 실패 (`401 Unauthorized`)

### 1. 문제 상황 (Problem)

- 콘솔에 `GET https://apis.data.go.kr/... 401 (Unauthorized)` 및 `네트워크 응답 에러: 401` 출력.

### 2. 원인 분석 (Cause)

- Template Literal 문자열 작성 과정에서 `serviceKey` 값 바로 앞에 달러 기호(`$`)가 잘못 포함되어 `serviceKey=$c680e7...` 형태로 전송됨.
- 이로 인해 API 서버가 올바르지 않은 Key 포맷으로 인식하고 인증을 거부함.

### 3. 해결 방법 (Solution)

- `API_KEY` 변수 지정 시 `$` 기호를 제거하고 순수 Decoding Key 문자열만 전달하도록 수정하여 401 인증 오류 해결.

---

## 📌 [이슈 04] 불필요한 Request Parameter로 인한 에러 (`INVALID_REQUEST_PARAMETER_ERROR`) 및 Null Pointer 계열 오류

### 1. 문제 상황 (Problem)

- `resultMsg: 'INVALID_REQUEST_PARAMETER_ERROR(listYN)'` 와 함께 `TypeError: Cannot read properties of undefined (reading 'body')` 발생.

### 2. 원인 분석 (Cause)

- 최신 API 규격에서 지원하지 않는 `listYN=Y` 파라미터가 요청 URL에 포함되어 서버에서 에러 응답(resultCode: 10)을 보냄.
- 서버 에러로 인해 정상 응답 객체 구조(`data.response.body`)가 생성되지 않은 상태에서 `body` 프로퍼티에 접근하려 하여 스크립트 실행이 중단됨.

### 3. 해결 방법 (Solution)

- 요청 URL에서 불필요한 `listYN` 파라미터를 제거.
- 데이터 처리 전 안전성 검사 조건문(`if (data.response && data.response.body && data.response.body.items)`)을 추가하여 무결성 확보 및 예외 처리 완료.

---

## [4일차 Issue] Spring Boot 생성 시 패키지 경로 불일치 문제 (`com.festival.seoul` -> `jar`)

### 1. 문제 상황 (Issue)

- Spring Initializr(`start.spring.io`)에서 Group을 `com.festival`, Artifact를 `seoul`로 설정했으나, IntelliJ에서 프로젝트를 연 후 `src/main/java` 하위를 확인하니 예상했던 `com.festival.seoul` 패키지 대신 `jar` 패키지(폴더)가 생성되어 있음.

### 2. 원인 분석 (Cause)

- 프로젝트 생성 옵션 중 Packaging 설정이 `Jar`로 지정되면서, 일부 초기화 설정 조건에 의해 루트 패키지명이 Packaging 이름인 `jar`로 자동 바인딩되어 생성됨.

### 3. 해결 방법 (Solution)

- **접근 방식**: 기존 패키지 구조를 강제로 재구성하는 대신, 자동 생성된 `jar` 패키지 경로를 그대로 활용하여 개발 진행.

1. `src/main/java/jar/` 경로 하위에 컨트롤러 클래스 `TestController.java` 생성.
2. 상단 패키지 선언을 `package jar;`로 명시.
3. 내장 서버 메인 클래스(`SeoulApplication` / `JarApplication`)를 실행하여 정상 가동 확인 및 API 통신 성공.

```java
package jar;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public String test() {
        return "Hello World! 서울 페스티벌 백엔드 서버가 성공적으로 열렸습니다!";
    }
}
```

## 📌 [5일차] 백엔드 DB 연동 및 공공 API 수집 이슈 모음

---

### 🚨 Issue 1. Gradle 및 Spring Boot 버전 불일치로 인한 `/h2-console` 접속 실패 (404 Error)

1. **문제 상황 (Problem)**
   - `application.yml`에 `spring.h2.console.enabled: true` 설정을 적용했음에도, `http://localhost:8080/h2-console` 접속 시 Whitelabel Error Page (404 Not Found) 발생
   - Gradle Sync 시 `java.lang.NoSuchMethodError: 'java.util.Set org.gradle.api.artifacts.LenientConfiguration.getArtifacts(...)'` 오류 출력

2. **원인 분석 (Cause)**
   - Gradle 버전과 Spring Boot 및 Dependency Management 플러그인간 호환성 버전 불일치로 인해 내부 메서드를 참조하지 못해 빌드 및 H2 콘솔 자동 매핑 설정이 정상 가동되지 못함.

3. **해결 방법 (Solution)**
   - `build.gradle` 내 플러그인 및 Spring Boot 버전을 최신 검증 조합으로 수정 후 Gradle Sync 실행
     ```groovy
     plugins {
         id 'java'
         id 'org.springframework.boot' version '3.2.5'
         id 'io.spring.dependency-management' version '1.1.6'
     }
     ```
   - 재시작 후 `http://localhost:8080/h2-console` 접속 시 H2 콘솔 로그인 화면 정상 출력 확인.

---

### 🚨 Issue 2. Spring Boot 메인 패키지 위치 이탈로 인한 JPA Entity 미인식 이슈

1. **문제 상황 (Problem)**
   - `Festival.java` Entity 작성 후 서버를 가동했으나, H2 Console에서 `FESTIVALS` 테이블이 생성되지 않음.

2. **원인 분석 (Cause)**
   - `domain` 패키지가 메인 클래스(`SeoulApplication.java`)가 있는 `Jar` 패키지와 동등한 위치(`src/main/java/domain`)에 존재하여, Spring Boot의 Component Scan 범위에서 제외됨.
   - `package com.festival.seoul.domain;` 선언과 실제 폴더 경로 mismatch 발생.

3. **해결 방법 (Solution)**
   - `domain` 폴더를 메인 패키지 하위 위치(`src/main/java/Jar/domain`)로 이동.
   - 패키지 선언 구문을 `package Jar.domain;`으로 수정하여 메인 클래스가 Entity 및 Repository를 인식하도록 정상화.

---

### 🚨 Issue 3. API 수집 실행 시 `Unexpected character ('<')` 파싱 에러 발생 및 데이터 0개 저장 이슈

1. **문제 상황 (Problem)**
   - `GET /api/festivals/save` 접속 시 `성공적으로 0개의 축제 데이터를 DB에 저장했습니다!` 메시지가 반환되고 데이터 적재 실패.
   - 서버 콘솔에 `com.fasterxml.jackson.core.JsonParseException: Unexpected character ('<' (code 60))` 예외 발생.

2. **원인 분석 (Cause)**
   - 서울시 API 서버 호출 시 유효하지 않은 API 키 또는 호출 인자 범위 오류로 인해, API 서버가 JSON 응답이 아닌 XML 형태의 에러 응답문(`<RESULT><CODE>INFO-100</CODE>...</RESULT>`)을 반환함.
   - JSON 파서가 `<` 문자를 읽으면서 JSON 구조 파싱 예외가 발생함.

3. **해결 방법 (Solution)**
   - 서울시 공공 API의 규격에 맞춰 공식 테스트용 키(`sample`) 적용 및 호출 데이터 범위를 `/1/5/`로 수정.
   - `ObjectMapper` 및 `JsonNode` 기반으로 응답 파싱 구조를 개편하고 예외 처리 로직을 적용하여 안정적으로 JSON 데이터를 파싱, 5개의 데이터가 H2 DB 테이블에 정상 적재되도록 조치함.

---

## [이슈 01] 백엔드 연동 후 카카오 지도 마커 미출력 문제 (좌표 필드명 불일치)

### 1. 문제 상황 (Problem)

- 외부 공공 API 직접 호출 방식에서 내 백엔드 API (`http://localhost:8080/api/festivals`) 연동 방식으로 변경한 후, 카카오 지도는 정상적으로 화면에 노출되나 마커가 전혀 찍히지 않는 현상 발생.
- 콘솔 출력: `✅ 성공적으로 생성된 마커 개수: 0개`

### 2. 원인 분석 (Cause)

- **공공 API JSON 구조**: 기존 공공 API 호출 시에는 위도/경도 속성명이 `mapy`, `mapx`였음.
- **내 백엔드 DB Entity 구조**: 백엔드 DB에는 `lat`, `lot` 필드명으로 저장되어 있었으나, `main.js`의 마커 생성 반복문에서 여전히 `item.mapy`, `item.mapx`를 참조하려고 하여 `undefined` 및 `NaN` 에러가 발생함.

### 3. 해결 방법 (Solution)

- `main.js` 내 마커 생성 로직의 좌표 파싱 구문을 백엔드 DB 속성명(`item.lat`, `item.lot`) 및 다양한 예외 상황에 대비할 수 있도록 유연하게 수정함.

```javascript
// 백엔드 DB 필드명(lat, lot)에 맞게 좌표 설정
var lat = parseFloat(item.lat || item.latitude || item.mapy);
var lng = parseFloat(item.lot || item.longitude || item.lng || item.mapx);

if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
  var markerPosition = new kakao.maps.LatLng(lat, lng);
  var marker = new kakao.maps.Marker({ position: markerPosition });
  marker.setMap(map);
}

## [이슈 02] 백엔드 응답 빈 배열(`Array(0)`)로 인한 마커 미노출 문제

### 1. 문제 상황 (Problem)
- 백엔드 주소 변경 후 카카오 지도는 정상 작동하나 마커가 전혀 표시되지 않음.
- 브라우저 개발자 도구 콘솔에 `📦 백엔드에서 넘어온 전체 데이터: Array(0)`, `⚠️ 백엔드 DB가 비어있습니다!` 메시지 출력.

### 2. 원인 분석 (Cause)
- Spring Boot 백엔드 서버는 정상 가동 중이었으나, DB(H2)에 축제 데이터가 초기화되거나 수집되지 않아 엔드포인트(`http://localhost:8080/api/festivals`) 호출 시 빈 배열(`[]`)만 반환함.

### 3. 해결 방법 (Solution)
1. 백엔드의 데이터 수집 전용 엔드포인트인 `http://localhost:8080/api/festivals/save`를 호출하여 서울시 공공 API 데이터를 H2 DB에 적재함.
2. 추가로 서버가 켜질 때 자동으로 DB 수집 로직이 작동하도록 `@PostConstruct` 방식을 적용함.
3. 데이터 적재 후 프론트엔드를 새로고침하여 5개의 JSON 축제 데이터를 수신하고 지도에 마커 5개가 정상 표시됨을 확인함.
```

---
