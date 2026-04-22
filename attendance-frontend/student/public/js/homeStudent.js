// Chỉ import những gì thực sự có trong authService.js
import { fetchWithAuth } from '../../../services/authService.js';

document.addEventListener("DOMContentLoaded", () => {
    // Gọi trực tiếp getUser() (vì nó đã là global từ file HTML)
    const quickUser = window.getUser ? window.getUser() : null; 
    
    if (quickUser) {
        const nameElem = document.getElementById('student-name');
        if (nameElem) nameElem.innerText = quickUser.name || "Sinh viên";
    }

    updateProfileData();
    loadTodaySchedule();
    startClock();
});

// Hàm cập nhật Profile từ API
async function updateProfileData() {
    try {
        const response = await fetchWithAuth('/student/profile');
        const profile = response.data.data; // Cấu trúc từ ProfileController: { success: true, data: {...} }

        if (profile.name) {
            document.getElementById('student-name').innerText = profile.name;
            
            // Cập nhật lại LocalStorage để đồng bộ
            const currentUser = getUser() || {};
            localStorage.setItem('user_info', JSON.stringify({ ...currentUser, ...profile }));
        }
    } catch (error) {
        console.error("Lỗi cập nhật Profile:", error);
    }
}

// Hàm lấy lịch học hôm nay (Khớp với ProfileController@getSchedule)
async function loadTodaySchedule() {
    const scheduleContainer = document.getElementById('today-schedule');
    if (!scheduleContainer) return;

    try {
        const response = await fetchWithAuth('/student/schedule'); 
        const schedule = response.data.data; // Backend trả về mảng các lớp kèm sessions

        if (!schedule || schedule.length === 0) {
            scheduleContainer.innerHTML = `
                <div class="text-center py-4 text-muted">
                    <i class="fas fa-calendar-check d-block mb-2"></i>
                    Hôm nay bạn không có lịch học.
                </div>`;
            return;
        }

        // Render danh sách lịch học
    scheduleContainer.innerHTML = schedule.map(item => {

    const session = item.sessions?.[0];
    const date = session?.date ? formatDate(session.date) : '';
    const check = session?.check_number || 1;

    return `
    <div class="schedule-item border-start border-4 border-brown ps-3 mb-3 py-2 shadow-sm bg-light rounded-end">

        <div class="d-flex justify-content-between align-items-start">

            <div>
                <div class="fw-bold text-brown">${item.subject_name}</div>

                <div class="small text-muted">
                    Mã lớp: ${item.class_code} |
                    Buổi: ${check}
                </div>
            </div>

            <span class="schedule-date today">
                ${date}
            </span>

        </div>

    </div>
    `;
}).join('');

    } catch (error) {
        console.error("Lỗi tải lịch học:", error);
        scheduleContainer.innerHTML = `<div class="text-danger small p-3 text-center">Không thể kết nối máy chủ để tải lịch học.</div>`;
    }
}

function startClock() {
    const clockElement = document.getElementById('dongHo');
    setInterval(() => {
        const now = new Date();
        clockElement.innerText = now.toLocaleTimeString('vi-VN');
    }, 1000);
}

function formatDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}