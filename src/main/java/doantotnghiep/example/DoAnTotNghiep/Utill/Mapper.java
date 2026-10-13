package doantotnghiep.example.DoAnTotNghiep.Utill;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Mapper {
    @Bean
    public ModelMapper getMapper() {
        return new ModelMapper();
    }
}
