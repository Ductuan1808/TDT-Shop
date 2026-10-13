package doantotnghiep.example.DoAnTotNghiep.Repository;

import doantotnghiep.example.DoAnTotNghiep.Entity.Pc_builds;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PcBuildRepository extends JpaRepository<Pc_builds, Long> {

}
