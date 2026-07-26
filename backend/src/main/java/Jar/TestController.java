package Jar;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public String test() {
        return "Hello World! 서울 페스티벌 백엔드 서버가 성공적으로 열렸습니다!";
    }
}