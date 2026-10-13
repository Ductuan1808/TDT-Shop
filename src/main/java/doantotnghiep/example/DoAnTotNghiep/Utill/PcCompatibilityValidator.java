package doantotnghiep.example.DoAnTotNghiep.Utill;

import doantotnghiep.example.DoAnTotNghiep.DTO.PcBuildComponentDTO;
import doantotnghiep.example.DoAnTotNghiep.Entity.Components.*;
import doantotnghiep.example.DoAnTotNghiep.Repository.Specs.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * PcCompatibilityValidator - Module kiểm tra tính hợp lệ và tương thích phần cứng PC Build.
 * Đặt tại package Utill, sử dụng cú pháp Java thuần, không dùng Lambda (->) hay Stream (.stream()).
 */
@Component
public class PcCompatibilityValidator {

    @Autowired
    private CpuRepository cpuRepository;

    @Autowired
    private MotherboardRepository motherboardRepository;

    @Autowired
    private RamRepository ramRepository;

    @Autowired
    private GpuRepository gpuRepository;

    @Autowired
    private SsdRepository ssdRepository;

    @Autowired
    private PsuRepository psuRepository;

    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private CoolerRepository coolerRepository;

    @Autowired
    private MonitorRepository monitorRepository;

    /**
     * Kiểm tra tính hợp lệ của các linh kiện trong dàn PC.
     * @param components Danh sách các linh kiện pc_build_components
     * @return Danh sách chi tiết các lỗi không tương thích (nếu rỗng nghĩa là hợp lệ 100%)
     */
    public List<String> validate(List<PcBuildComponentDTO> components) {
        List<String> errors = new ArrayList<String>();

        if (components == null || components.isEmpty()) {
            errors.add("Chưa có linh kiện nào được chọn cho dàn PC.");
            return errors;
        }

        Long cpuId = null;
        Long mbId = null;
        Long ramId = null;
        int ramQty = 1;
        Long gpuId = null;
        Long ssdId = null;
        Long psuId = null;
        Long caseId = null;
        Long coolerId = null;
        Long monitorId = null;

        // Trích xuất ID các linh kiện theo loại bằng vòng lặp for truyền thống
        for (int i = 0; i < components.size(); i++) {
            PcBuildComponentDTO c = components.get(i);
            if (c == null || c.getComponentType() == null) continue;

            String type = c.getComponentType().trim().toUpperCase();
            Long prodId = c.getComponentProductId();

            if ("CPU".equals(type)) {
                cpuId = prodId;
            } else if ("MAINBOARD".equals(type)) {
                mbId = prodId;
            } else if ("RAM".equals(type)) {
                ramId = prodId;
                if (c.getQuantity() != null && c.getQuantity().intValue() > 0) {
                    ramQty = c.getQuantity().intValue();
                }
            } else if ("GPU".equals(type)) {
                gpuId = prodId;
            } else if ("SSD".equals(type)) {
                ssdId = prodId;
            } else if ("PSU".equals(type)) {
                psuId = prodId;
            } else if ("CASE".equals(type)) {
                caseId = prodId;
            } else if ("COOLER".equals(type)) {
                coolerId = prodId;
            } else if ("MONITOR".equals(type)) {
                monitorId = prodId;
            }
        }

        // 1. Kiểm tra đủ 8 loại linh kiện cốt lõi của PC
        if (cpuId == null) {
            errors.add("Chưa chọn Bộ vi xử lý (CPU) - Linh kiện bắt buộc để PC hoạt động.");
        }
        if (mbId == null) {
            errors.add("Chưa chọn Bo mạch chủ (Mainboard) - Nền tảng kết nối các linh kiện.");
        }
        if (ramId == null) {
            errors.add("Chưa chọn Bộ nhớ RAM - Cần tối thiểu 1 thanh RAM.");
        }
        if (gpuId == null) {
            errors.add("Chưa chọn Card màn hình (GPU) - Cần thiết để xử lý hình ảnh và đồ họa.");
        }
        if (ssdId == null) {
            errors.add("Chưa chọn Ổ cứng SSD - Bắt buộc để cài hệ điều hành và lưu trữ.");
        }
        if (psuId == null) {
            errors.add("Chưa chọn Nguồn máy tính (PSU) - Cung cấp năng lượng cho dàn máy.");
        }
        if (caseId == null) {
            errors.add("Chưa chọn Vỏ Case máy tính - Khung cố định và bảo vệ linh kiện.");
        }
        if (coolerId == null) {
            errors.add("Chưa chọn Tản nhiệt (Cooler) - Giải nhiệt làm mát cho CPU.");
        }

        // Nếu thiếu linh kiện cốt lõi, trả về danh sách thiếu
        if (!errors.isEmpty()) {
            return errors;
        }

        // Nạp thông số từ database
        Optional<Cpu> optCpu = cpuRepository.findById(cpuId);
        Optional<Motherboard> optMb = motherboardRepository.findById(mbId);
        Optional<Ram> optRam = ramRepository.findById(ramId);
        Optional<Gpu> optGpu = gpuRepository.findById(gpuId);
        Optional<Ssd> optSsd = ssdRepository.findById(ssdId);
        Optional<Psu> optPsu = psuRepository.findById(psuId);
        Optional<Case> optCase = caseRepository.findById(caseId);
        Optional<Cooler> optCooler = coolerRepository.findById(coolerId);

        Cpu cpu = optCpu.isPresent() ? optCpu.get() : null;
        Motherboard mb = optMb.isPresent() ? optMb.get() : null;
        Ram ram = optRam.isPresent() ? optRam.get() : null;
        Gpu gpu = optGpu.isPresent() ? optGpu.get() : null;
        Ssd ssd = optSsd.isPresent() ? optSsd.get() : null;
        Psu psu = optPsu.isPresent() ? optPsu.get() : null;
        Case cs = optCase.isPresent() ? optCase.get() : null;
        Cooler cl = optCooler.isPresent() ? optCooler.get() : null;

        // 2. Kiểm tra Socket CPU vs Bo mạch chủ
        if (cpu != null && mb != null) {
            String cpuSocket = cpu.getSocket() != null ? cpu.getSocket().trim() : "";
            String mbSocket = mb.getSocket() != null ? mb.getSocket().trim() : "";
            if (!cpuSocket.isEmpty() && !mbSocket.isEmpty()) {
                if (!isSocketMatched(cpuSocket, mbSocket)) {
                    errors.add("Không tương thích Socket giữa CPU và Bo mạch chủ: CPU sử dụng Socket " 
                            + cpuSocket + ", trong khi Bo mạch chủ sử dụng Socket " + mbSocket 
                            + ". Hai linh kiện này không thể lắp ráp cùng nhau!");
                }
            }
        }

        // 3. Kiểm tra Chuẩn RAM (DDR4 / DDR5) vs Bo mạch chủ
        if (ram != null && mb != null) {
            String ramType = ram.getMemoryType() != null ? ram.getMemoryType().trim().toUpperCase() : "";
            String mbRamType = mb.getMemoryType() != null ? mb.getMemoryType().trim().toUpperCase() : "";
            if (!ramType.isEmpty() && !mbRamType.isEmpty()) {
                if (!mbRamType.contains(ramType)) {
                    errors.add("Không tương thích chuẩn RAM với Bo mạch chủ: Bo mạch chủ chỉ hỗ trợ " 
                            + mbRamType + ", nhưng thanh RAM đã chọn là chuẩn " + ramType + "!");
                }
            }

            // Số lượng thanh RAM vs khe cắm RAM của Bo mạch chủ
            if (mb.getRamSlots() != null && ramQty > mb.getRamSlots().intValue()) {
                errors.add("Số lượng thanh RAM đã chọn (" + ramQty + " thanh) vượt quá số khe RAM trên Bo mạch chủ (chỉ có " 
                        + mb.getRamSlots() + " khe)!");
            }
        }

        // 4. Kiểm tra Bo mạch chủ vs Kích thước Vỏ Case (Form Factor)
        if (mb != null && cs != null) {
            String mbForm = mb.getFormFactor() != null ? mb.getFormFactor().trim() : "";
            String csSupport = cs.getFormFactorSupport() != null ? cs.getFormFactorSupport().trim() : "";
            if (!mbForm.isEmpty() && !csSupport.isEmpty()) {
                if (!isFormFactorSupported(mbForm, csSupport)) {
                    errors.add("Kích thước Bo mạch chủ (" + mbForm + ") không vừa với Vỏ Case. Vỏ Case chỉ hỗ trợ: " 
                            + csSupport + "!");
                }
            }
        }

        // 5. Kiểm tra Nguồn (PSU) vs Card đồ họa (GPU)
        if (gpu != null && psu != null) {
            Integer gpuWatt = gpu.getRecommendedPsuWatt();
            Integer psuWatt = psu.getWattage();
            if (gpuWatt != null && psuWatt != null) {
                if (psuWatt.intValue() < gpuWatt.intValue()) {
                    errors.add("Công suất nguồn (PSU) không đủ: Nguồn đã chọn có công suất " + psuWatt 
                            + "W, trong khi Card màn hình GPU yêu cầu tối thiểu " + gpuWatt + "W!");
                }
            }
        }

        // 6. Kiểm tra Chiều dài Card đồ họa vs Vỏ Case
        if (gpu != null && cs != null) {
            Integer gpuLen = gpu.getLengthMm();
            Integer maxLen = cs.getMaxGpuLengthMm();
            if (gpuLen != null && maxLen != null) {
                if (gpuLen.intValue() > maxLen.intValue()) {
                    errors.add("Card đồ họa quá dài so với Vỏ Case: Chiều dài GPU là " + gpuLen 
                            + "mm, trong khi Vỏ Case chỉ hỗ trợ tối đa " + maxLen + "mm!");
                }
            }
        }

        // 7. Kiểm tra Tản nhiệt vs Socket CPU
        if (cl != null && cpu != null) {
            String clSockets = cl.getSupportedSockets() != null ? cl.getSupportedSockets().trim() : "";
            String cpuSocket = cpu.getSocket() != null ? cpu.getSocket().trim() : "";
            if (!clSockets.isEmpty() && !cpuSocket.isEmpty()) {
                if (!isCoolerSocketSupported(clSockets, cpuSocket)) {
                    errors.add("Tản nhiệt không hỗ trợ Socket " + cpuSocket + " của CPU. Danh sách socket tản hỗ trợ: " 
                            + clSockets + "!");
                }
            }
        }

        // 8. Kiểm tra Chiều cao Tản nhiệt khí vs Vỏ Case
        if (cl != null && cs != null) {
            if (cl.getHeightMm() != null && cl.getHeightMm().intValue() > 0 && cs.getMaxCpuCoolerHeightMm() != null) {
                if (cl.getHeightMm().intValue() > cs.getMaxCpuCoolerHeightMm().intValue()) {
                    errors.add("Chiều cao tản nhiệt khí (" + cl.getHeightMm() 
                            + "mm) vượt quá khoảng trống Vỏ Case cho phép (" + cs.getMaxCpuCoolerHeightMm() + "mm)!");
                }
            }
            if (cl.getRadiatorSizeMm() != null && cl.getRadiatorSizeMm().intValue() > 0 && cs.getMaxRadiatorSizeMm() != null) {
                if (cl.getRadiatorSizeMm().intValue() > cs.getMaxRadiatorSizeMm().intValue()) {
                    errors.add("Kích thước Radiator tản nhiệt nước (" + cl.getRadiatorSizeMm() 
                            + "mm) lớn hơn vị trí lắp két nước tối đa của Vỏ Case (" + cs.getMaxRadiatorSizeMm() + "mm)!");
                }
            }
        }

        // 9. Phụ kiện Màn hình (nếu có chọn)
        if (monitorId != null) {
            Optional<Monitor> optMon = monitorRepository.findById(monitorId);
            if (!optMon.isPresent()) {
                // Màn hình hợp lệ nếu tồn tại sản phẩm
            }
        }

        return errors;
    }

    private boolean isSocketMatched(String cpuSocket, String mbSocket) {
        if (cpuSocket == null || mbSocket == null) return false;
        String s1 = cpuSocket.toLowerCase().replace("socket", "").replace(" ", "").replace("-", "").trim();
        String s2 = mbSocket.toLowerCase().replace("socket", "").replace(" ", "").replace("-", "").trim();
        return s1.equalsIgnoreCase(s2);
    }

    private boolean isFormFactorSupported(String mbForm, String caseSupport) {
        if (mbForm == null || caseSupport == null) return false;
        String mb = mbForm.toLowerCase().replace("-", "").replace(" ", "").trim();
        String cs = caseSupport.toLowerCase().replace("-", "").replace(" ", "").trim();

        if (mb.equals("matx") || mb.equals("microatx")) mb = "microatx";
        if (mb.equals("itx") || mb.equals("miniitx")) mb = "miniitx";
        if (mb.equals("eatx") || mb.equals("extendedatx")) mb = "eatx";

        if (cs.contains(mb)) return true;
        if (cs.contains("atx") && (mb.equals("microatx") || mb.equals("miniitx") || mb.equals("atx"))) return true;
        if (cs.contains("eatx") && (mb.equals("atx") || mb.equals("microatx") || mb.equals("miniitx"))) return true;

        return false;
    }

    private boolean isCoolerSocketSupported(String coolerSockets, String cpuSocket) {
        if (coolerSockets == null || cpuSocket == null) return false;
        String cs = coolerSockets.toLowerCase().replace("-", "").replace(" ", "");
        String cpu = cpuSocket.toLowerCase().replace("-", "").replace(" ", "").replace("socket", "");

        if (cs.contains(cpu)) return true;
        if (cpu.contains("1700") && cs.contains("1700")) return true;
        if (cpu.contains("am5") && cs.contains("am5")) return true;
        if (cpu.contains("am4") && cs.contains("am4")) return true;
        if (cpu.contains("1200") && cs.contains("1200")) return true;

        return false;
    }
}
