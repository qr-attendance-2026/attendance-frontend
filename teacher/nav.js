document.addEventListener("DOMContentLoaded", function () {
    const navContent = `
        <div class="sidebar">
            <div class="logo">
                <div class="logo-box">QR</div>
                <span>QR Attendance</span>
            </div>
            
            <a href="teacher-dashboard.html" class="nav-item">
                <i class="bi bi-calendar3 me-2"></i> Lịch dạy hôm nay
            </a>
           
            <a href="teacher-checkin.html" class="nav-item">
                <i class="bi bi-qr-code-scan me-2"></i> Điểm danh QR
            </a>
            
            <a href="teacher-history.html" class="nav-item">
                <i class="bi bi-clock-history me-2"></i> Lịch sử & Chỉnh sửa
            </a>

            <div class="mt-auto">
                <a href="login.html" class="text-danger text-decoration-none small">
                    <i class="bi bi-box-arrow-left me-2"></i> Đăng xuất
                </a>
            </div>
        </div>

        <div class="topbar">
            <div class="d-flex align-items-center">
                <span class="me-2 fw-medium">Teacher User</span>
                <div class="avatar">T</div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("afterbegin", navContent);

    // Xử lý trạng thái Active
    const currentPage = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll(".sidebar a");
    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
});