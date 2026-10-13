package doantotnghiep.example.DoAnTotNghiep.Service;

import doantotnghiep.example.DoAnTotNghiep.DTO.VoucherDTO;
import doantotnghiep.example.DoAnTotNghiep.MODEL.PageResponse;

import java.util.List;

public interface VoucherService {

    PageResponse<VoucherDTO> getVouchers(String keyword, String status, int page, int size);

    List<VoucherDTO> getAllVouchers();

    VoucherDTO getVoucherById(Long id);

    VoucherDTO createVoucher(VoucherDTO dto);

    VoucherDTO updateVoucher(Long id, VoucherDTO dto);

    VoucherDTO toggleVoucherStatus(Long id);
}
