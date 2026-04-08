const form = document.getElementById("formDangNhap");
const mssvInput = document.getElementById("mssv");
const error = document.getElementById("errorMssv");

// validate + login
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const mssv = mssvInput.value.trim();
    const regex = /^[a-zA-Z0-9]+$/;

    if (!regex.test(mssv)) {
        error.classList.remove("d-none");
        mssvInput.classList.add("is-invalid");
        return;
    }

    error.classList.add("d-none");
    mssvInput.classList.remove("is-invalid");

    const btn = document.querySelector(".btn-login");
    btn.innerText = "Đang đăng nhập...";
    btn.disabled = true;

    setTimeout(() => {
        btn.innerText = "Đăng nhập";
        btn.disabled = false;

        window.location.href = "../student/home.html";
    }, 1200);
});

// popup quên mật khẩu
document.getElementById("quenMatKhau").addEventListener("click", function(e){
    e.preventDefault();

    const modal = new bootstrap.Modal(document.getElementById('modalQuenMK'));
    modal.show();
});