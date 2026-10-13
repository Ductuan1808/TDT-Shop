//ẩn - hiện mật khẩu
function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    button.textContent = "Ẩn";
  } else {
    input.type = "password";
    button.textContent = "Hiện";
  }
}

//phần cho trang đăng nhập
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();

    const password = document.getElementById("loginPassword").value;

    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ thông tin!");

      return;
    }

    /*
     * DEMO
     *
     * Sau này thay đoạn này bằng
     * API Spring Boot.
     */

    const loginData = {
      username: username,

      password: password,
    };

    console.log("Login data:", loginData);
    alert("Đăng nhập demo thành công!");

    /*
     * Ví dụ sau này:
     *
     * fetch("http://localhost:8080/api/auth/login", {
     *
     *     method: "POST",
     *
     *     headers: {
     *         "Content-Type": "application/json"
     *     },
     *
     *     body: JSON.stringify(loginData)
     *
     * })
     */
  });
}



/* =====================================================
   REGISTER
===================================================== */

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();

    const username = document.getElementById("username").value.trim();

    const email = document.getElementById("email").value.trim();

    const phone = document.getElementById("phone").value.trim();

    const password = document.getElementById("registerPassword").value;

    const confirmPassword = document.getElementById("confirmPassword").value;

    /* =========================
               VALIDATE
            ========================= */

    if (password.length < 6) {
      showRegisterError("Mật khẩu phải có ít nhất 6 ký tự.");

      return;
    }

    if (password !== confirmPassword) {
      showRegisterError("Mật khẩu xác nhận không khớp.");

      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      showRegisterError("Email không hợp lệ.");

      return;
    }

    /* =========================
               REGISTER DATA
            ========================= */

    const registerData = {
      username: username,

      email: email,

      password: password,

      full_name: fullName,

      phone: phone,
    };

    console.log("Register data:", registerData);

    /* =========================
               SHOW LOADING
            ========================= */

    openRegisterStatus();

    showRegisterLoading();

    /*
     * DEMO DELAY
     *
     * Sau này bỏ đoạn setTimeout này
     * và thay bằng fetch API Spring Boot.
     */

    await new Promise((resolve) => setTimeout(resolve, 1800));

    /* =========================
               DEMO SUCCESS
            ========================= */

    showRegisterSuccess();
  });
}

/* =====================================================
   OPEN MODAL
===================================================== */

function openRegisterStatus() {
  const modal = document.getElementById("registerStatusModal");

  modal.classList.add("active");
}

/* =====================================================
   LOADING STATE
===================================================== */

function showRegisterLoading() {
  document.getElementById("registerLoading").classList.add("active");

  document.getElementById("registerSuccess").classList.remove("active");

  document.getElementById("registerError").classList.remove("active");
}

/* =====================================================
   SUCCESS STATE
===================================================== */

function showRegisterSuccess() {
  document.getElementById("registerLoading").classList.remove("active");

  document.getElementById("registerSuccess").classList.add("active");

  document.getElementById("registerError").classList.remove("active");

  let seconds = 3;

  document.getElementById("countdown").textContent = seconds;

  const countdown = setInterval(function () {
    seconds--;

    document.getElementById("countdown").textContent = seconds;

    if (seconds <= 0) {
      clearInterval(countdown);

      goToLogin();
    }
  }, 1000);
}

/* =====================================================
   ERROR STATE
===================================================== */

function showRegisterError(message) {
  openRegisterStatus();

  document.getElementById("registerLoading").classList.remove("active");

  document.getElementById("registerSuccess").classList.remove("active");

  document.getElementById("registerError").classList.add("active");

  document.getElementById("registerErrorMessage").textContent = message;
}

/* =====================================================
   CLOSE MODAL
===================================================== */

function closeRegisterStatus() {
  document.getElementById("registerStatusModal").classList.remove("active");
}

/* =====================================================
   GO TO LOGIN
===================================================== */

function goToLogin() {
  window.location.href = "/login";
}
