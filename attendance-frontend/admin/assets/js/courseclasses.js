// ===== DATA =====
let courseClasses = [];
const API_BASE_URL = "https://api-attendance-backend-520975280881.asia-southeast1.run.app/api";

function showToast(msg) {
    const t = document.getElementById("toast");
    t.innerText = msg;
    t.style.display = "block";
    setTimeout(() => t.style.display = "none", 2000);
}

async function fetchCourseClasses() {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE_URL}/admin/course-classes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (response.ok) {
            let resData = [];
            if (Array.isArray(data.data)) resData = data.data; 
            else if (data.data && Array.isArray(data.data.data)) resData = data.data.data; 
            else if (Array.isArray(data)) resData = data; 

            courseClasses = resData.map(c => ({
                id: c.id,
                semester: c.semester || "-",
                academic_year: c.academic_year || "-",
                subjectName: (c.subject && (c.subject.subject_name || c.subject.name)) || "-",
                group: c.course_name || c.class_group || c.group || "-",
                teacherName: (c.teacher && c.teacher.user && c.teacher.user.name) || (c.teacher && c.teacher.teacher_code) || "-",
                dayOfWeek: c.day_of_week || "-",
                period: c.start_period && c.end_period ? `${c.start_period} - ${c.end_period}` : "-",
                room: c.room || c.room_number || "-",
                startDate: c.start_date || "-",
                endDate: c.end_date || "-"
            }));
            renderTable();
        } else {
            showToast(data.message || "Không thể lấy dữ liệu lớp học phần");
        }
    } catch (error) {
        showToast("Lỗi kết nối API");
    }
}

// ===== RENDER =====
function renderTable(data = courseClasses) {
    const tbody = document.querySelector("#academicTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="11" style="text-align:center;color:#94a3b8">
                    Không có dữ liệu
                </td>
            </tr>
        `;
        return;
    }

    data.forEach((item) => {
        tbody.innerHTML += `
        <tr>
            <td>${item.semester}</td>
            <td>${item.academic_year}</td>
            <td>${item.subjectName}</td>
            <td>${item.group}</td>
            <td>${item.teacherName}</td>
            <td>${item.dayOfWeek}</td>
            <td>${item.period}</td>
            <td>${item.room}</td>
            <td>${item.startDate}</td>
            <td>${item.endDate}</td>
            <td>
                <!-- Hành động tùy thích -->
            </td>
        </tr>
        `;
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

    showToast("Đang tải lên lịch trình...");

    try {
        const response = await fetch(`${API_BASE_URL}/admin/import/schedule`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();
        
        if (response.ok) {
            showToast(data.message || "Import lịch trình thành công!");
            closeImport();
            fetchCourseClasses(); // Load lại data
        } else {
            showToast(data.message || "Import thất bại!");
        }
    } catch (error) {
        showToast("Lỗi kết nối API: " + error.message);
    }
}

// ===== LOAD =====
document.addEventListener("DOMContentLoaded", () => {
    fetchCourseClasses();

    // SEARCH
    const search = document.getElementById("searchAcademic");
    if (search) {
        search.addEventListener("input", function () {
            const keyword = this.value.toLowerCase();

            const filtered = courseClasses.filter(item =>
                item.subjectName.toLowerCase().includes(keyword) ||
                item.teacherName.toLowerCase().includes(keyword) ||
                item.group.toLowerCase().includes(keyword)
            );
            renderTable(filtered);
        });
    }

    // ===== IMPORT BUTTON =====
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
