document.addEventListener("DOMContentLoaded", function () {
    // 1. Lấy thông tin giảng viên từ localStorage (đã lưu lúc login)
    const teacherName = localStorage.getItem('teacher_name') || "Giảng viên";
    const firstLetter = teacherName.charAt(0).toUpperCase();

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
                <a href="../../index.html" class="text-danger text-decoration-none small" id="logoutBtn">
                    <i class="bi bi-box-arrow-left me-2"></i> Đăng xuất
                </a>
            </div>
        </div>

        <div class="topbar">
            <div class="d-flex align-items-center">
                <span class="me-2 fw-medium">${teacherName}</span>
                <div class="avatar">${firstLetter}</div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("afterbegin", navContent);

    // 2. Xử lý logic Đăng xuất (Xóa sạch session khi thoát)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear(); // Xóa token và thông tin user
        });
    }

    // 3. Xử lý trạng thái Active
    const currentPage = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll(".sidebar a");
    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
});