package doantotnghiep.example.DoAnTotNghiep.Repository.Specs;

import doantotnghiep.example.DoAnTotNghiep.Entity.Components.Ram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RamRepository extends JpaRepository<Ram, Long> {}
