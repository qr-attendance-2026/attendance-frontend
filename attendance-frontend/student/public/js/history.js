document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "https://api-attendance-backend-520975280881.asia-southeast1.run.app/api";
    const token = localStorage.getItem("token");

    // 1. Tải Sidebar
    fetch("../layout/sidebar.html").then(res => res.text()).then(data => {
        document.getElementById("sidebar-container").innerHTML = data;
        const current = window.location.pathname;
        document.querySelectorAll(".menu-item").forEach(link => {
            if (link.getAttribute("href") && current.includes(link.getAttribute("href"))) link.classList.add("active");
        });
    });

    // 2. API Summary (Thanh phần trăm)
    async function fetchSummary() {
        const res = await fetch(`${API_URL}/student/attendance/summary`, {
            headers: { "Authorization": "Bearer " + token }
        });
        if (res.ok) {
            const result = await res.json();
            const box = document.getElementById("summaryBox");
            if (!box || !result.data) return;
            
            box.innerHTML = result.data.map(item => {
                const rate = item.rate || 0;
                let color = rate < 50 ? "bg-danger" : (rate < 80 ? "bg-warning" : "bg-success");
                return `
                <div class="col-md-4 mb-3">
                    <div class="card-summary p-3 h-100" style="background: rgba(255,255,255,0.05); border-radius: 15px;">
                        <h6 class="text-info fw-bold">${item.subject_name}</h6>
                        <div class="d-flex justify-content-between small mt-3"><span>Tỷ lệ đi học</span><b>${rate}%</b></div>
                        <div class="progress mt-1" style="height: 6px;"><div class="progress-bar ${color}" style="width: ${rate}%"></div></div>
                        <div class="mt-3 small d-flex justify-content-between">
                            <span class="text-success">✅ Có mặt: ${item.present}</span><span class="text-danger">❌ Vắng: ${item.absent}</span>
                        </div>
                    </div>
                </div>`;
            }).join('');
        }
    }

    // 3. API Bảng lịch sử
    async function fetchHistoryTable() {
        const res = await fetch(`${API_URL}/student/attendance`, {
            headers: { "Authorization": "Bearer " + token }
        });
        if (res.ok) {
            const result = await res.json();
            const raw = result.data?.data || result.data || [];
            const tbody = document.getElementById("attendanceTable");
            tbody.innerHTML = raw.map(item => `
                <tr>
                    <td class="ps-4 fw-bold text-info">${item.checked_at ? item.checked_at.split('T')[0] : 'N/A'}</td>
                    <td><div class="fw-bold">${item.session?.course_class?.subject?.subject_name || "Môn học"}</div></td>
                    <td>Ca ${item.session?.check_number || 1}</td>
                    <td>${item.session?.course_class?.teacher?.user?.name || "Giảng viên"}</td>
                    <td class="text-center"><span class="badge ${item.status === 'present' ? 'bg-success' : 'bg-danger'}">${item.status === 'present' ? 'Có mặt' : 'Vắng'}</span></td>
                </tr>`).join('');
        }
    }

    fetchSummary();
    fetchHistoryTable();
});