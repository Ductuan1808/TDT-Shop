package doantotnghiep.example.DoAnTotNghiep.DTO;

import java.util.ArrayList;
import java.util.List;

/**
 * PcCompatibilityResultDTO - Kết quả kiểm tra độ tương thích phần cứng giữa các linh kiện PC.
 * 
 * QUY TẮC THIẾT KẾ:
 * - Trả về trạng thái tương thích (compatible: true/false).
 * - Danh sách lỗi xung đột phần cứng nghiêm trọng (errors).
 * - Danh sách cảnh báo tối ưu hóa (warnings).
 * - Danh sách các tiêu chí đã tương thích thành công (successMessages).
 * - Phục vụ cả màn hình Build PC Admin và màn hình Build PC cho Khách hàng sau này.
 */
public class PcCompatibilityResultDTO {
    private boolean compatible;
    private List<String> errors = new ArrayList<>();
    private List<String> warnings = new ArrayList<>();
    private List<String> successMessages = new ArrayList<>();
    private Integer estimatedWattage;

    public PcCompatibilityResultDTO() {
        this.compatible = true;
    }

    public PcCompatibilityResultDTO(boolean compatible, List<String> errors, List<String> warnings, List<String> successMessages, Integer estimatedWattage) {
        this.compatible = compatible;
        this.errors = errors != null ? errors : new ArrayList<>();
        this.warnings = warnings != null ? warnings : new ArrayList<>();
        this.successMessages = successMessages != null ? successMessages : new ArrayList<>();
        this.estimatedWattage = estimatedWattage;
    }

    public boolean isCompatible() {
        return compatible;
    }

    public void setCompatible(boolean compatible) {
        this.compatible = compatible;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    public List<String> getWarnings() {
        return warnings;
    }

    public void setWarnings(List<String> warnings) {
        this.warnings = warnings;
    }

    public List<String> getSuccessMessages() {
        return successMessages;
    }

    public void setSuccessMessages(List<String> successMessages) {
        this.successMessages = successMessages;
    }

    public Integer getEstimatedWattage() {
        return estimatedWattage;
    }

    public void setEstimatedWattage(Integer estimatedWattage) {
        this.estimatedWattage = estimatedWattage;
    }

    public void addError(String error) {
        this.errors.add(error);
        this.compatible = false;
    }

    public void addWarning(String warning) {
        this.warnings.add(warning);
    }

    public void addSuccess(String success) {
        this.successMessages.add(success);
    }
}
