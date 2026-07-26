package Jar.service;

import Jar.domain.Festival;
import Jar.domain.FestivalRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FestivalService {

    private final FestivalRepository festivalRepository;

    // 💡 서울시 열린데이터 광장 공식 테스트용 샘플키
    private final String API_KEY = "sample";

    @Transactional
    public int fetchAndSaveFestivals() {
        // 샘플키(sample) 사용 시 호출 범위는 1 ~ 5 까지만 허용됩니다.
        String url = "http://openapi.seoul.go.kr:8088/" + API_KEY + "/json/culturalEventInfo/1/5/";

        RestTemplate restTemplate = new RestTemplate();
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            URI uri = new URI(url);
            String responseString = restTemplate.getForObject(uri, String.class);

            // JSON 파싱
            JsonNode rootNode = objectMapper.readTree(responseString);
            JsonNode culturalEventInfo = rootNode.get("culturalEventInfo");

            if (culturalEventInfo == null) {
                System.out.println("⚠️ 응답 수신 실패: " + responseString);
                return 0;
            }

            JsonNode rowNode = culturalEventInfo.get("row");
            if (rowNode == null || !rowNode.isArray()) {
                return 0;
            }

            List<Festival> festivalList = new ArrayList<>();

            for (JsonNode item : rowNode) {
                String title = item.has("TITLE") ? item.get("TITLE").asText() : "제목 없음";
                String place = item.has("PLACE") ? item.get("PLACE").asText() : "";
                String startDate = item.has("STRTDATE") ? item.get("STRTDATE").asText() : "";
                String endDate = item.has("END_DATE") ? item.get("END_DATE").asText() : "";
                String useTrgt = item.has("USE_TRGT") ? item.get("USE_TRGT").asText() : "";
                String isFree = item.has("IS_FREE") ? item.get("IS_FREE").asText() : "";

                Double lat = null;
                Double lot = null;

                try {
                    if (item.has("LAT") && !item.get("LAT").asText().isBlank()) {
                        lat = item.get("LAT").asDouble();
                    }
                    if (item.has("LOT") && !item.get("LOT").asText().isBlank()) {
                        lot = item.get("LOT").asDouble();
                    }
                } catch (Exception ignored) {}

                Festival festival = Festival.builder()
                        .title(title)
                        .place(place)
                        .startDate(startDate)
                        .endDate(endDate)
                        .useTrgt(useTrgt)
                        .isFree(isFree)
                        .lat(lat)
                        .lot(lot)
                        .build();

                festivalList.add(festival);
            }

            List<Festival> saved = festivalRepository.saveAll(festivalList);
            return saved.size();

        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public List<Festival> getAllFestivals() {
        return festivalRepository.findAll();
    }
}