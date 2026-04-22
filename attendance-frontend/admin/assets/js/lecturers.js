// ===== TOAST =====
function showToast(msg) {
    const t = document.getElementById("toast");
    t.innerText = msg;
    t.style.display = "block";
    setTimeout(() => t.style.display = "none", 2000);
}

// ===== DATA =====
let lecturers = [];
const API_BASE_URL = "https://api-attendance-backend-520975280881.asia-southeast1.run.app/api";

async function fetchLecturers() {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE_URL}/admin/users?role=teacher`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (response.ok) {
            let users = [];
            if (Array.isArray(data.data)) users = data.data; 
            else if (data.data && Array.isArray(data.data.data)) users = data.data.data; 
            else if (Array.isArray(data)) users = data; 

            const teacherUsers = users.filter(u => u.role === 'teacher' || u.teacher !== null);

            lecturers = teacherUsers.map(u => ({
                id: u.teacher && u.teacher.teacher_code ? u.teacher.teacher_code : u.id,
                name: u.name,
                email: u.email || "-",
                subject: u.teacher && u.teacher.department ? u.teacher.department : "-"
            }));
            renderTable();
        } else {
            showToast(data.message || "Không thể lấy dữ liệu giảng viên");
        }
    } catch (error) {
        showToast("Lỗi kết nối API");
    }
}

// ===== RENDER =====
function renderTable(data = lecturers) {
    const tbody = document.querySelector("#lecturerTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;color:#94a3b8">
                    Không có dữ liệu
                </td>
            </tr>
        `;
        return;
    }

    data.forEach((gv, index) => {
        tbody.innerHTML += `
        <tr>
            <td>${gv.id}</td>
            <td>${gv.name}</td>
            <td>${gv.email}</td>
            <td>${gv.subject}</td>
            <td>
                <!-- Action buttons based on requirements -->
            </td>
        </tr>`;
    });
}

function closeImport() {
    const modal = document.getElementById("importModal");
    if (modal) modal.style.display = "none";
}

async function handleExcelFile(file) {
    if (!file) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
        showToast("Vui lòng đăng nhập");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    showToast("Đang tải lên...");

    try {
        const response = await fetch(`${API_BASE_URL}/admin/import/teachers`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();
        
        if (response.ok) {
            showToast(data.message || "Import thành công!");
            closeImport();
            fetchLecturers(); // Load lại data
        } else {
            showToast(data.message || "Import thất bại!");
        }
    } catch (error) {
        showToast("Lỗi kết nối API: " + error.message);
    }
}

// ===== LOAD =====
document.addEventListener("DOMContentLoaded", () => {
    fetchLecturers();

    // SEARCH
    const search = document.getElementById("search");
    if (search) {
        search.addEventListener("input", function () {
            const k = this.value.toLowerCase();

            renderTable(lecturers.filter(g =>
                g.id.toLowerCase().includes(k) ||
                g.name.toLowerCase().includes(k) ||
                g.subject.toLowerCase().includes(k) ||
                g.email.toLowerCase().includes(k)
            ));
        });
    }

    // IMPORT
    const btnImport = document.getElementById("btnImport");
    const fileInput = document.getElementById("excelFile");

    if (btnImport && fileInput) {
        btnImport.addEventListener("click", () => fileInput.click());

        fileInput.addEventListener("change", (e) => {
            handleExcelFile(e.target.files[0]);
        });
    }

    // ===== DRAG DROP =====
    const uploadBox = document.getElementById("uploadBox");
    if (uploadBox && fileInput) {
        uploadBox.addEventListener("click", () => fileInput.click());
        uploadBox.addEventListener("dragover", (e) => {
            e.preventDefault();
            uploadBox.classList.add("dragover");
        });
        uploadBox.addEventListener("dragleave", () => {
            uploadBox.classList.remove("dragover");
        });
        uploadBox.addEventListener("drop", (e) => {
            e.preventDefault();
            uploadBox.classList.remove("dragover");
            handleExcelFile(e.dataTransfer.files[0]);
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