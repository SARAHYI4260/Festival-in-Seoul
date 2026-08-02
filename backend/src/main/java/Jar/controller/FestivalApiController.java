package Jar.controller;

import Jar.domain.Festival;
import Jar.service.FestivalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/festivals")
@CrossOrigin(origins = "*") // ⭐ CORS 브라우저 보안 차단 해제
@RequiredArgsConstructor
public class FestivalApiController {

    private final FestivalService festivalService;

    // 1. 공공 API 호출해서 DB에 데이터 저장하기
    @GetMapping("/save")
    public String saveFestivals() {
        int count = festivalService.fetchAndSaveFestivals();
        return "성공적으로 " + count + "개의 축제 데이터를 DB에 저장했습니다!";
    }

    // 2. DB에 저장된 모든 축제 데이터 JSON으로 조회하기
    // 검색 및 필터링 API (지역 / 키워드 / 날짜)
    @GetMapping("/search")
    public List<Festival> searchFestivals(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String date) {
        return festivalService.searchFestivals(district, keyword, date);
    }
}