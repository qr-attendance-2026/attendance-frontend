// ===== DATA =====
let subjects = [];
const API_BASE_URL = "https://api-attendance-backend-520975280881.asia-southeast1.run.app/api";

function showToast(msg) {
    const t = document.getElementById("toast");
    t.innerText = msg;
    t.style.display = "block";
    setTimeout(() => t.style.display = "none", 2000);
}

async function fetchSubjects() {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE_URL}/admin/subjects`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (response.ok) {
            let resData = [];
            if (Array.isArray(data.data)) resData = data.data; 
            else if (data.data && Array.isArray(data.data.data)) resData = data.data.data; 
            else if (Array.isArray(data)) resData = data; 

            subjects = resData.map((s, index) => ({
                stt: index + 1,
                id: s.id,
                code: s.subject_code || s.code || s.subject_id || "-",
                name: s.subject_name || s.name || "-"
            }));
            renderTable();
        } else {
            showToast(data.message || "Không thể lấy dữ liệu môn học");
        }
    } catch (error) {
        showToast("Lỗi kết nối API");
    }
}

// ===== RENDER =====
function renderTable(data = subjects) {
    const tbody = document.querySelector("#academicTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;color:#94a3b8">
                    Không có dữ liệu
                </td>
            </tr>
        `;
        return;
    }

    data.forEach((item) => {
        tbody.innerHTML += `
        <tr>
            <td>${item.stt}</td>
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>
                <!-- Hành động tùy thích -->
            </td>
        </tr>
        `;
    });
}

// ===== LOAD =====
document.addEventListener("DOMContentLoaded", () => {
    fetchSubjects();

    // SEARCH
    const search = document.getElementById("searchAcademic");
    if (search) {
        search.addEventListener("input", function () {
            const keyword = this.value.toLowerCase();

            const filtered = subjects.filter(item =>
                item.code.toLowerCase().includes(keyword) ||
                item.name.toLowerCase().includes(keyword)
            );
            renderTable(filtered);
        });
    }

});

// ===== LOGOUT =====
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            if (confirm("Bạn có chắc muốn đăng xuất?")) {
                localStorage.clear();
            }
        });
    }
});
