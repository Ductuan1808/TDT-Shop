package doantotnghiep.example.DoAnTotNghiep.Repository.Specs;

import doantotnghiep.example.DoAnTotNghiep.Entity.Components.Headset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HeadsetRepository extends JpaRepository<Headset, Long> {}
