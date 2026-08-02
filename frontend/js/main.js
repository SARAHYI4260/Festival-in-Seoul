kakao.maps.load(function () {
  var mapContainer = document.getElementById("map");
  var mapOption = {
    center: new kakao.maps.LatLng(37.5665, 126.978),
    level: 7,
  };
  var map = new kakao.maps.Map(mapContainer, mapOption);

  var markers = [];
  var currentInfoWindow = null;

  function removeMarkers() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
  }

  function loadFestivals(district, keyword, date) {
    var url = "http://localhost:8080/api/festivals/search?";
    if (district) url += "district=" + encodeURIComponent(district) + "&";
    if (keyword) url += "keyword=" + encodeURIComponent(keyword) + "&";
    if (date) url += "date=" + encodeURIComponent(date);

    console.log("🚀 백엔드 요청 URL:", url);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        removeMarkers();

        if (!data || data.length === 0) {
          alert("검색 결과가 없습니다.");
          return;
        }

        var bounds = new kakao.maps.LatLngBounds();
        var markerCount = 0;

        data.forEach((item) => {
          var lat = item.lat;
          var lng = item.lot;

          if (lat && lng) {
            var position = new kakao.maps.LatLng(lat, lng);
            var marker = new kakao.maps.Marker({
              map: map,
              position: position,
            });

            // 💡 마커 클릭 시 정보창(InfoWindow) 노출
            var iwContent = `<div style="padding:10px;font-size:12px;width:180px;">
                <strong>${item.title}</strong><br>
                📍 ${item.place || "장소 미정"}<br>
                📅 ${item.startDate} ~ ${item.endDate}
              </div>`;

            var infowindow = new kakao.maps.InfoWindow({
              content: iwContent,
              removable: true,
            });

            kakao.maps.event.addListener(marker, "click", function () {
              if (currentInfoWindow) currentInfoWindow.close();
              infowindow.open(map, marker);
              currentInfoWindow = infowindow;
            });

            markers.push(marker);
            bounds.extend(position);
            markerCount++;
          }
        });

        if (markerCount > 0) {
          map.setBounds(bounds);
        }
      })
      .catch((error) => console.error("❌ API 불러오기 실패:", error));
  }

  // 최초 전체 데이터 로드
  loadFestivals("", "", "");

  var searchBtn = document.getElementById("search-btn");
  var districtSelect = document.getElementById("district-select");
  var dateSelect = document.getElementById("date-select");
  var searchInput = document.getElementById("search-input");

  function doSearch() {
    var district = districtSelect ? districtSelect.value : "";
    var date = dateSelect ? dateSelect.value : "";
    var keyword = searchInput ? searchInput.value.trim() : "";

    console.log(
      "🔍 검색 조건 - 자치구:",
      district,
      "| 날짜:",
      date,
      "| 키워드:",
      keyword,
    );
    loadFestivals(district, keyword, date);
  }

  if (searchBtn) searchBtn.addEventListener("click", doSearch);
  if (districtSelect) districtSelect.addEventListener("change", doSearch);
  if (dateSelect) dateSelect.addEventListener("change", doSearch);
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") doSearch();
    });
  }
});
