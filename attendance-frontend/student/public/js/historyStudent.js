import { fetchWithAuth } from '../../../services/authService.js';


document.addEventListener("DOMContentLoaded", () => {
    // Sửa 'token' thành 'access_token'
    if (!localStorage.getItem('access_token')) { 
        console.warn("Không tìm thấy token, mời đăng nhập.");
        window.location.href = "../../../index.html"; // Sửa đường dẫn về trang chủ nếu cần
        return;
    }
    loadSummary();
    loadAttendanceHistory();


    
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const keyword = document.getElementById('searchInput').value.toLowerCase();
            filterTable(keyword);
        });
    }
});

let allRecords = []; 

async function loadSummary() {
    const summaryBox = document.getElementById('summaryBox');
    try {
        const response = await fetchWithAuth('/student/attendance/summary');
        // BE trả về: { success: true, data: [ {present: 5, absent: 1, ...}, ... ] }
        const data = response.data?.data || []; 

        let totalPresent = 0;
        let totalAbsent = 0;

        data.forEach(item => {
            totalPresent += (item.present || 0);
            totalAbsent += (item.absent || 0);
        });

        summaryBox.innerHTML = `
            <div class="col-md-6">
                <div class="summary-card shadow-sm p-3 border-start border-success border-4 bg-white rounded">
                    <small class="text-muted text-uppercase fw-bold">Tổng buổi có mặt</small>
                    <h3 class="text-success fw-bold mb-0">${totalPresent}</h3>
                </div>
            </div>
            <div class="col-md-6">
                <div class="summary-card shadow-sm p-3 border-start border-danger border-4 bg-white rounded">
                    <small class="text-muted text-uppercase fw-bold">Tổng buổi vắng</small>
                    <h3 class="text-danger fw-bold mb-0">${totalAbsent}</h3>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Lỗi tải tóm tắt:", error);
        summaryBox.innerHTML = `<div class="col-12 text-danger small px-3">Không thể tải thống kê chuyên cần.</div>`;
    }
}

// historyStudent.js
async function loadAttendanceHistory() {
    const tableBody = document.getElementById('attendanceTable');
    try {
        const response = await fetchWithAuth('/student/attendance');
        
        // KIỂM TRA DỮ LIỆU Ở ĐÂY
        console.log("Dữ liệu BE trả về:", response);

        // Theo code BE của bạn, dữ liệu nằm ở response.data.data
        // Chúng ta thêm dấu || [] để nếu dữ liệu trống thì nó vẫn là mảng rỗng, không bị crash
        allRecords = response.data?.data || [];

        if (!Array.isArray(allRecords) || allRecords.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4">Bạn chưa có lịch sử điểm danh nào.</td></tr>`;
            return;
        }

        renderTable(allRecords);
    } catch (error) {
        console.error("Lỗi tải lịch sử:", error);
        tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger py-4">Lỗi kết nối máy chủ.</td></tr>`;
    }
}

function renderTable(records) {
    const tableBody = document.getElementById('attendanceTable');
    tableBody.innerHTML = records.map(item => {
        // Truy cập theo cấu trúc: Record -> Session -> CourseClass -> Subject
        const session = item.session || {};
        const courseClass = session.course_class || {}; 
        const subject = courseClass.subject || {};
        
        const subjectName = subject.subject_name || "Môn học không xác định";
        const classCode = courseClass.class_code || "N/A";
        
        // Trạng thái (present, absent, late)
        const statusMap = {
            'present': { text: 'Có mặt', class: 'bg-success' },
            'absent': { text: 'Vắng mặt', class: 'bg-danger' },
            'late': { text: 'Đi muộn', class: 'bg-warning text-dark' }
        };
        const statusInfo = statusMap[item.status] || { text: item.status, class: 'bg-secondary' };

        // Phương thức điểm danh
        const methodMap = {
            'qr': 'Quét mã QR',
            'face': 'Khuôn mặt',
            'manual': 'Giảng viên ghi'
        };
        const methodText = methodMap[item.method] || 'Hệ thống';

        return `
            <tr>
                <td class="ps-4">
                    <div class="fw-bold text-brown">${formatDate(item.checked_at || session.date)}</div>
                    <small class="text-muted">${item.checked_at ? formatTime(item.checked_at) : '--:--'}</small>
                </td>
                <td>
                    <div class="fw-bold">${subjectName}</div>
                    <div class="text-muted x-small">Mã lớp: ${classCode} | Buổi số: ${session.check_number || '-'}</div>
                </td>
                <td>
                    <div class="small text-brown-muted">
                        <i class="fas ${item.method === 'qr' ? 'fa-qrcode' : 'fa-user-check'} me-1"></i> 
                        ${methodText}
                    </div>
                </td>
                <td class="text-center">
                    <span class="badge ${statusInfo.class} shadow-sm px-3">${statusInfo.text}</span>
                </td>
            </tr>
        `;
    }).join('');
}

// Cập nhật hàm lọc để tìm kiếm theo tên môn học
function filterTable(keyword) {
    const filtered = allRecords.filter(item => {
        const subject = (item.session?.course_class?.subject?.subject_name || '').toLowerCase();
        const classCode = (item.session?.course_class?.class_code || '').toLowerCase();
        return subject.includes(keyword) || classCode.includes(keyword);
    });
    renderTable(filtered);
}
function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function formatTime(dateString) {
    if (!dateString) return "--:--";
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}