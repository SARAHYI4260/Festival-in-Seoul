package Jar.domain; // 👈 기존 com.festival.seoul.domain; 대신 이렇게 작성하셔야 합니다!

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "festivals")
public class Festival {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;       // 축제명
    private String place;       // 장소
    private String startDate;   // 시작일
    private String endDate;     // 종료일
    private String useTrgt;     // 이용대상
    private String isFree;      // 이용요금(무료/유료)
    private Double lat;         // 위도
    private Double lot;         // 경도

    @Builder
    public Festival(String title, String place, String startDate, String endDate, String useTrgt, String isFree, Double lat, Double lot) {
        this.title = title;
        this.place = place;
        this.startDate = startDate;
        this.endDate = endDate;
        this.useTrgt = useTrgt;
        this.isFree = isFree;
        this.lat = lat;
        this.lot = lot;
    }
}