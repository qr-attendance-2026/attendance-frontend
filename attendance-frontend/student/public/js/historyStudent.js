// Đường dẫn: student/public/js/history.js
import apiClient from '../../teacher/services/apiClient.js';
import "../../public/js/sidebar.js"; // Tự động render sidebar

let allHistoryData = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchSummary();
    fetchHistory(1);

    // Gán sự kiện cho nút lọc
    const btnFilter = document.getElementById('btnFilter');
    if (btnFilter) {
        btnFilter.addEventListener('click', filterData);
    }
});

// Thống kê chuyên cần theo môn
async function fetchSummary() {
    const summaryBox = document.getElementById('summaryBox');
    try {
        const response = await apiClient.get('/student/attendance/summary');
        const summaryData = response.data.data;

        summaryBox.innerHTML = summaryData.map(item => `
            <div class="col-md-4 col-lg-3">
                <div class="card-summary p-3 text-center" style="background: rgba(255,255,255,0.05); border-radius: 15px; border: 1px solid rgba(255,255,255,0.1);">
                    <div class="text-white-50 small text-uppercase mb-1">${item.class_code}</div>
                    <div class="fw-bold text-truncate mb-2" title="${item.subject_name}">${item.subject_name}</div>
                    <div class="d-flex justify-content-between align-items-end">
                        <span class="h4 mb-0 text-danger">${item.rate}%</span>
                        <span class="small text-white-50">${item.present}/${item.total} Buổi</span>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        summaryBox.innerHTML = '<div class="col-12 text-center text-white-50 py-4">Không có dữ liệu thống kê.</div>';
    }
}

// Lấy danh sách lịch sử điểm danh
async function fetchHistory(page = 1) {
    const tableBody = document.getElementById('attendanceTable');
    try {
        const response = await apiClient.get(`/student/attendance?page=${page}`);
        const pagination = response.data.data; 
        
        allHistoryData = pagination.data;
        renderTable(allHistoryData);
        // Lưu ý: Cần viết thêm hàm renderPagination nếu bạn dùng phân trang của Laravel
        
        document.getElementById('showingResult').innerText = `Hiển thị ${pagination.from || 0} - ${pagination.to || 0} trong ${pagination.total} bản ghi`;
    } catch (error) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger py-4">Lỗi tải dữ liệu.</td></tr>';
    }
}

function renderTable(records) {
    const tableBody = document.getElementById('attendanceTable');
    if (!records || !records.length) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-white-50 py-4">Chưa có lịch sử điểm danh.</td></tr>';
        return;
    }

    tableBody.innerHTML = records.map(record => `
        <tr>
            <td class="ps-4">
                <div class="fw-bold">${new Date(record.checked_at).toLocaleDateString('vi-VN')}</div>
                <div class="small text-white-50">${new Date(record.checked_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</div>
            </td>
            <td>
                <div class="text-danger fw-bold">${record.session?.course_class?.subject?.subject_name || 'N/A'}</div>
                <div class="small text-white-50">${record.session?.course_class?.class_code || 'N/A'}</div>
            </td>
            <td>Ca ${record.session?.check_number || '?'}</td>
            <td>${record.session?.course_class?.teacher?.user?.name || "N/A"}</td>
            <td class="text-center">
                <span class="badge ${record.status === 'present' ? 'bg-success' : 'bg-secondary'} rounded-pill px-3">
                    ${record.status === 'present' ? 'Hiện diện' : 'Vắng'}
                </span>
            </td>
        </tr>
    `).join('');
}

// Hàm lọc dữ liệu tại chỗ (Client-side)
export const filterData = () => {
    const keyword = document.getElementById('searchInput').value.toLowerCase().trim();
    const filtered = allHistoryData.filter(record => {
        const subject = record.session?.course_class?.subject?.subject_name?.toLowerCase() || "";
        const teacher = record.session?.course_class?.teacher?.user?.name?.toLowerCase() || "";
        return subject.includes(keyword) || teacher.includes(keyword);
    });
    renderTable(filtered);
};

// Cho phép gọi từ HTML nếu cần
window.changePage = (page) => fetchHistory(page);