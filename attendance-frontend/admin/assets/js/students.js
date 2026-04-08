// ===== DATA =====
let students = [];
const API_BASE_URL = "https://api-attendance-backend-520975280881.asia-southeast1.run.app/api";

async function fetchStudents() {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE_URL}/admin/users?role=student`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
            let users = [];
            if (Array.isArray(data.data)) {
                users = data.data; 
            } else if (data.data && Array.isArray(data.data.data)) {
                users = data.data.data; 
            } else if (Array.isArray(data)) {
                users = data; 
            }

            const studentUsers = users.filter(u => u.role === 'student' || u.student !== null);

            students = studentUsers.map(u => ({
                id: u.student && u.student.student_code ? u.student.student_code : u.id,
                name: u.name,
                class: u.student && u.student.cohort_class ? u.student.cohort_class : "-",
                email: u.email
            }));
            renderStudents();
        } else {
            showToast(data.message || "Không thể lấy dữ liệu sinh viên");
        }
    } catch (error) {
        showToast("Lỗi kết nối");
    }
}

let editIndex = null;

// ===== TOAST =====
function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.innerText = msg;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
}

// ===== RENDER =====
function renderStudents(data = students) {
    const table = document.getElementById("studentTable");
    table.innerHTML = "";

    if (data.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;color:#94a3b8;">
                    Không có dữ liệu
                </td>
            </tr>
        `;
        return;
    }

    data.forEach((s, index) => {
        table.innerHTML += `
        <tr>
            <td>${s.id}</td>
            <td>${s.name}</td>
            <td>${s.class}</td>
            <td>${s.email || "-"}</td>
            <td>
                <button class="btn btn-primary" onclick="openEdit(${index})">✏️</button>
                <button class="btn btn-danger" onclick="deleteStudent(${index})">🗑️</button>
            </td>
        </tr>
        `;
    });
}

// ===== ADD =====
function addStudent() {
    editIndex = null;

    document.getElementById("modalTitle").innerText = "Thêm sinh viên";
    document.getElementById("mssv").value = "";
    document.getElementById("name").value = "";
    document.getElementById("class").value = "";
    document.getElementById("email").value = ""; 

    document.getElementById("modal").style.display = "flex";
}

// ===== EDIT =====
function openEdit(index) {
    editIndex = index;
    const sv = students[index];

    document.getElementById("modalTitle").innerText = "Sửa sinh viên";
    document.getElementById("mssv").value = sv.id;
    document.getElementById("name").value = sv.name;
    document.getElementById("class").value = sv.class;
    document.getElementById("email").value = sv.email || ""; 

    document.getElementById("modal").style.display = "flex";
}

// ===== SAVE =====
function saveStudent() {
    const id = document.getElementById("mssv").value.trim();
    const name = document.getElementById("name").value.trim();
    const className = document.getElementById("class").value.trim();
    const email = document.getElementById("email").value.trim(); 

    if (!id || !name || !className || !email) {
        showToast("Vui lòng nhập đầy đủ!");
        return;
    }

    if (editIndex === null) {
        students.push({ id, name, class: className, email });
        showToast("Thêm thành công!");
    } else {
        students[editIndex] = { id, name, class: className, email };
        showToast("Cập nhật thành công!");
    }

    if (!email.includes("@")) {
    showToast("Email không hợp lệ!");
    return;
}
    closeModal();
    renderStudents();
}

// ===== CLOSE =====
function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// ===== DELETE =====
function deleteStudent(index) {
    if (confirm("Bạn có chắc muốn xóa?")) {
        students.splice(index, 1);
        renderStudents();
        showToast("Đã xóa!");
    }
}

// ===== IMPORT EXCEL =====
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
        const response = await fetch(`${API_BASE_URL}/admin/import/students`, {
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
            fetchStudents(); // Load lại data
        } else {
            showToast(data.message || "Import thất bại!");
        }
    } catch (error) {
        console.error(error);
        showToast("Lỗi kết nối API: " + error.message);
    }
}

// ===== LOAD =====
document.addEventListener("DOMContentLoaded", () => {
    fetchStudents();

    // SEARCH
    const searchInput = document.getElementById("search");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const keyword = this.value.toLowerCase();

            const filtered = students.filter(sv =>
                sv.id.toLowerCase().includes(keyword) ||
                sv.name.toLowerCase().includes(keyword) ||
                sv.class.toLowerCase().includes(keyword)
            );

            renderStudents(filtered);
        });
    }

    const btnAdd = document.getElementById("btnAdd");
    if (btnAdd) {
        btnAdd.addEventListener("click", addStudent);
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

    // ===== DRAG DROP (nếu có modal import) =====
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

            // confirm cho xịn
            if (confirm("Bạn có chắc muốn đăng xuất?")) {

                // xóa dữ liệu nếu cần
                localStorage.clear();
            }
        });
    }
});