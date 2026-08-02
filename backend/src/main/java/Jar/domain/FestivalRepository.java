package Jar.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FestivalRepository extends JpaRepository<Festival, Long> {

    // 동적 검색을 위한 JPQL (지역, 키워드, 날짜 모두 optional 처리)
    @Query("SELECT f FROM Festival f WHERE " +
            "(:district IS NULL OR :district = '' OR f.place LIKE CONCAT('%', :district, '%')) AND " +
            "(:keyword IS NULL OR :keyword = '' OR f.title LIKE CONCAT('%', :keyword, '%')) AND " +
            "(:targetDate IS NULL OR :targetDate = '' OR (f.startDate <= :targetDate AND f.endDate >= :targetDate))")
    List<Festival> searchWithFilters(@Param("district") String district,
                                     @Param("keyword") String keyword,
                                     @Param("targetDate") String targetDate);
}