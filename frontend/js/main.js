kakao.maps.load(function () {
  // 1. 지도 생성 (서울시청 중심)
  var mapContainer = document.getElementById("map"),
    mapOption = {
      center: new kakao.maps.LatLng(37.5665, 126.978),
      level: 7,
    };
  var map = new kakao.maps.Map(mapContainer, mapOption);

  // 2. 한국관광공사 Decoding 인증키
  var API_KEY =
    "c680e733c55eeffd3c6242b4c79700a4ed192e6eb37edb4624d63acfe45517ef";

  // 3. 한국관광공사 행사/축제 조회 API URL (listYN 제거 및 정돈)
  var openApiUrl = `https://apis.data.go.kr/B551011/KorService2/searchFestival2?serviceKey=${API_KEY}&numOfRows=20&pageNo=1&MobileOS=ETC&MobileApp=FestivalApp&_type=json&arrange=A&areaCode=1&eventStartDate=20260101`;

  // 4. fetch 요청
  kakao.maps.load(function () {
    // 1. 지도 기본 위치 설정 (서울시청 기준)
    var mapContainer = document.getElementById("map"),
      mapOption = {
        center: new kakao.maps.LatLng(37.5665, 126.978),
        level: 7,
      };
    var map = new kakao.maps.Map(mapContainer, mapOption);

    // 2. 내 백엔드 API (http://localhost:8080/api/festivals) 데이터 호출
    fetch("http://localhost:8080/api/festivals")
      .then((response) => response.json())
      .then((data) => {
        console.log("📦 백엔드에서 넘어온 전체 데이터:", data);
        console.log("📊 데이터 개수:", data.length);

        if (Array.isArray(data) && data.length > 0) {
          var count = 0;
          data.forEach(function (item) {
            // 💡 백엔드 필드명이 다를 경우에 대비해 모든 가능성을 수용하도록 처리
            var lat = parseFloat(item.lat || item.latitude || item.mapy);
            var lng = parseFloat(
              item.lot || item.longitude || item.lng || item.mapx,
            );

            if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
              var markerPosition = new kakao.maps.LatLng(lat, lng);
              var marker = new kakao.maps.Marker({
                position: markerPosition,
              });
              marker.setMap(map);
              count++;
            } else {
              console.warn("⚠️ 좌표값을 읽을 수 없는 항목:", item);
            }
          });
          console.log(`✅ 성공적으로 생성된 마커 개수: ${count}개`);
        } else {
          console.warn("⚠️ 백엔드 DB가 비어있습니다!");
        }
      })
      .catch((error) => {
        console.error("❌ API 호출 실패:", error);
      });
  });
});
