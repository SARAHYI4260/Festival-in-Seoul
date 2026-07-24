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
  fetch(openApiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("네트워크 응답 에러: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      console.log("🎉 한국관광공사 데이터 로드 성공:", data);

      // API 응답 데이터 안전성 체크
      if (data.response && data.response.body && data.response.body.items) {
        var festivalList = data.response.body.items.item;

        // 5. 반복문으로 카카오 지도 위에 축제 마커 여러 개 생성
        festivalList.forEach(function (item) {
          var lat = parseFloat(item.mapy); // 위도
          var lng = parseFloat(item.mapx); // 경도

          if (lat && lng) {
            var markerPosition = new kakao.maps.LatLng(lat, lng);
            var marker = new kakao.maps.Marker({
              position: markerPosition,
            });
            marker.setMap(map);
          }
        });
      } else {
        console.warn("⚠️ 축제 데이터 항목이 비어있습니다.", data);
      }
    })
    .catch((error) => {
      console.error("❌ API 호출 failure:", error);
    });
});
