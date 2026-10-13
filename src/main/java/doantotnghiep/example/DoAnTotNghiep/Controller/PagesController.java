package doantotnghiep.example.DoAnTotNghiep.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class PagesController {

    @GetMapping("/")
    public String index() {
        return "redirect:/home";
    }


    @GetMapping("/home")
    public String home() {
        return "forward:/pages/users/home.html";
    }

    // 2. Màn chi tiết sản phẩm: Cần có ID sản phẩm, nếu không có ID sẽ đá về danh sách sản phẩm
    @GetMapping("/product-detail")
    public String productDetail(@RequestParam(value = "id", required = false) Long id) {
        if (id == null || id <= 0) {
            return "redirect:/products?error=missing_id";
        }
        return "forward:/pages/users/productDetail.html";
    }

    // 3. Màn danh sách sản phẩm
    @GetMapping("/products")
    public String productList() {
        return "forward:/pages/users/productList.html";
    }

    // 4. Màn Build PC
    @GetMapping("/build-pc")
    public String buildPc() {
        return "forward:/pages/users/buildPc.html";
    }

    // 5. Màn giỏ hàng
    @GetMapping("/cart")
    public String cart() {
        return "forward:/pages/users/cart.html";
    }

    // 6. Màn đăng nhập
    @GetMapping("/login")
    public String login() {
        return "forward:/pages/users/login.html";
    }

    // 7. Màn đăng ký
    @GetMapping("/register")
    public String register() {
        return "forward:/pages/users/register.html";
    }

    // 8. Màn thông tin cá nhân
    @GetMapping("/user")
    public String userProfile() {
        return "forward:/pages/users/user.html";
    }

    // 9. Màn quản trị Admin
    @GetMapping("/admin")
    public String adminPage() {
        return "forward:/pages/admin/admin.html";
    }
}
