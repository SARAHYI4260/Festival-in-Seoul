function initKakaoMap() {
  if (typeof kakao === "undefined" || !kakao.maps) {
    setTimeout(initKakaoMap, 100);
    return;
  }

  kakao.maps.load(function () {
    var mapContainer = document.getElementById("map"),
      mapOption = {
        center: new kakao.maps.LatLng(37.5665, 126.978), // 서울시청 좌표
        level: 7,
      };

    var map = new kakao.maps.Map(mapContainer, mapOption);

    var markerPosition = new kakao.maps.LatLng(37.5665, 126.978);

    var marker = new kakao.maps.Marker({
      position: markerPosition,
    });

    marker.setMap(map);

    // 지도가 깨지거나 안 보일 때 크기를 다시 맞춰주는 안전 코드 추가
    setTimeout(function () {
      map.relayout();
      map.setCenter(new kakao.maps.LatLng(37.5665, 126.978));
    }, 300);
  });
}

window.addEventListener("DOMContentLoaded", initKakaoMap);
