package doantotnghiep.example.DoAnTotNghiep.Repository.Specs;

import doantotnghiep.example.DoAnTotNghiep.Entity.Components.Gpu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GpuRepository extends JpaRepository<Gpu, Long> {}
