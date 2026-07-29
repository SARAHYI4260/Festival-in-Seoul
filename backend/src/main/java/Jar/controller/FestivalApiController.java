package Jar.controller;

import Jar.domain.Festival;
import Jar.service.FestivalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin; // ⭐ missing import 추가
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    @GetMapping
    public List<Festival> getAllFestivals() {
        return festivalService.getAllFestivals();
    }
}