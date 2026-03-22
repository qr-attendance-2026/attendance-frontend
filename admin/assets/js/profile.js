console.log("PROFILE JS LOADED");
// ===== LƯU THÔNG TIN =====
function updateProfile() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !email) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    alert("Cập nhật thành công!");
}

// ===== MỞ MODAL =====
function openPasswordModal() {
    const modal = document.getElementById("passwordModal");
    modal.style.display = "flex";
    modal.style.pointerEvents = "auto";
}

// ===== ĐÓNG MODAL =====
function closePasswordModal() {
    document.getElementById("passwordModal").style.display = "none";
}

// ===== ĐỔI MẬT KHẨU =====
function changePassword() {
    const oldPass = document.getElementById("oldPass").value.trim();
    const newPass = document.getElementById("newPass").value.trim();
    const confirmPass = document.getElementById("confirmPass").value.trim();

    if (!oldPass || !newPass || !confirmPass) {
        alert("Vui lòng nhập đầy đủ!");
        return;
    }

    if (newPass.length < 4) {
        alert("Mật khẩu mới phải ít nhất 4 ký tự!");
        return;
    }

    if (newPass !== confirmPass) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
    }

    alert("Đổi mật khẩu thành công!");

    // đóng modal sau khi đổi
    closePasswordModal();
}

// ===== CLICK NGOÀI MODAL ĐỂ ĐÓNG =====
window.onclick = function (e) {
    const modal = document.getElementById("passwordModal");
    if (e.target === modal) {
        closePasswordModal();
    }
};