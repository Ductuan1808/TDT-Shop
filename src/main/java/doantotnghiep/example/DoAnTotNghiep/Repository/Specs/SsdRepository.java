package doantotnghiep.example.DoAnTotNghiep.Repository.Specs;

import doantotnghiep.example.DoAnTotNghiep.Entity.Components.Ssd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SsdRepository extends JpaRepository<Ssd, Long> {}
