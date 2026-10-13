package doantotnghiep.example.DoAnTotNghiep.Repository.Specs;

import doantotnghiep.example.DoAnTotNghiep.Entity.Components.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CpuRepository extends JpaRepository<Cpu, Long> {}
