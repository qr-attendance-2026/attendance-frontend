// Đường dẫn: student/public/js/sidebar.js

function renderSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) return;

    // Lấy tên file hiện tại để highlight menu
    const currentPath = window.location.pathname.split("/").pop() || 'homeStudent.html';

    const sidebarHTML = `
    <div class="sidebar d-flex flex-column" style="height: 100vh; min-width: 250px; background: #1a1a1a;">
        
        <div class="p-4 border-bottom border-light border-opacity-10">
            <div class="d-flex align-items-center gap-3">
                <div class="avatar" id="sidebar-avatar" style="width: 45px; height: 45px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">--</div>
                <div class="user-text">
                    <h6 class="mb-0 text-white user-name" id="sidebar-user-name" style="font-size: 14px;">Đang tải...</h6>
                    <small class="text-light opacity-75" id="sidebar-user-code" style="font-size: 12px;">........</small>
                </div>
            </div>
        </div>

        <div class="flex-grow-1 p-3 d-flex flex-column gap-1">
            <a href="homeStudent.html" class="menu-item ${currentPath.includes('home') ? 'active' : ''}">🏠 Trang chủ</a>
            <a href="scanQR.html" class="menu-item ${currentPath.includes('scan') ? 'active' : ''}">📷 Quét QR</a>
            <a href="studentQR.html" class="menu-item ${currentPath.includes('studentQR') ? 'active' : ''}">📱 QR cá nhân</a>
            <a href="resumeStudent.html" class="menu-item ${currentPath.includes('resume') ? 'active' : ''}">👤 Hồ sơ</a>
            <a href="historyStudent.html" class="menu-item ${currentPath.includes('history') ? 'active' : ''}">⏱ Lịch sử</a>
        </div>

        <div class="p-3 border-top border-light border-opacity-10">
            <a href="javascript:void(0)" class="menu-item logout text-danger" id="btnLogout" style="text-decoration: none; display: flex; align-items: center; gap: 10px;">
                🚪 <span>Đăng xuất</span>
            </a>
        </div>
    </div>
    `;

    sidebarContainer.innerHTML = sidebarHTML;
    
    // Gọi các hàm hỗ trợ để đổ dữ liệu và thiết lập sự kiện
    loadUserSidebarInfo();
    setupLogout();
}

function loadUserSidebarInfo() {
    // Lấy thông tin đã lưu từ login thành công
    const userName = localStorage.getItem('student_name') || 'Sinh viên';
    const studentCode = localStorage.getItem('student_code') || 'Chưa cập nhật';
    
    const nameEl = document.getElementById('sidebar-user-name');
    const codeEl = document.getElementById('sidebar-user-code');
    const avatarEl = document.getElementById('sidebar-avatar');

    if (nameEl) nameEl.innerText = userName;
    if (codeEl) codeEl.innerText = studentCode;

    // Tạo Avatar tự động từ tên
    if (avatarEl && userName !== 'Sinh viên') {
        const parts = userName.trim().split(' ');
        if (parts.length > 1) {
            avatarEl.innerText = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        } else {
            avatarEl.innerText = parts[0][0].toUpperCase();
        }
    }
}

function setupLogout() {
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.onclick = () => {
            if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?")) {
                localStorage.clear(); 
                window.location.href = "/SAMS/index.html"; 
            }
        };
    }
}

// Khởi chạy khi tài liệu sẵn sàng
document.addEventListener("DOMContentLoaded", renderSidebar);