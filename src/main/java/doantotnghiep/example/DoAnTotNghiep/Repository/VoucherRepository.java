package doantotnghiep.example.DoAnTotNghiep.Repository;

import doantotnghiep.example.DoAnTotNghiep.Entity.Vouchers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Vouchers, Long> {
    Optional<Vouchers> findByCode(String code);
    boolean existsByCode(String code);
}
