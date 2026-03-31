// ===== TOAST =====
function showToast(msg) {
    const t = document.getElementById("toast");
    t.innerText = msg;
    t.style.display = "block";
    setTimeout(() => t.style.display = "none", 2000);
}

// ===== DATA =====
let academics = JSON.parse(localStorage.getItem("academics")) || [
    { faculty: "CNTT", major: "Công nghệ thông tin", class: "D22_TH01", subject: "Lập trình Web" }
];

let editIndex = null;

// ===== SAVE LOCAL =====
function saveLocal() {
    localStorage.setItem("academics", JSON.stringify(academics));
}

// ===== RENDER =====
function renderAcademic(data = academics) {
    const tbody = document.querySelector("#academicTable tbody");
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

    data.forEach((item, index) => {
        tbody.innerHTML += `
        <tr>
            <td>${item.faculty}</td>
            <td>${item.major}</td>
            <td>${item.class}</td>
            <td>${item.subject}</td>
            <td>
                <button class="btn btn-primary" onclick="editAcademic(${index})">✏️</button>
                <button class="btn btn-danger" onclick="deleteAcademic(${index})">🗑️</button>
            </td>
        </tr>
        `;
    });
}

// ===== MODAL =====
function openAcademic() {
    document.getElementById("modalAcademic").style.display = "flex";
}

function closeAcademic() {
    document.getElementById("modalAcademic").style.display = "none";
    clearForm();
}

function clearForm() {
    document.getElementById("faculty").value = "";
    document.getElementById("major").value = "";
    document.getElementById("classAcademic").value = "";
    document.getElementById("subject").value = "";
}

// ===== SAVE =====
function saveAcademic() {
    const faculty = document.getElementById("faculty").value.trim();
    const major = document.getElementById("major").value.trim();
    const className = document.getElementById("classAcademic").value.trim();
    const subject = document.getElementById("subject").value.trim();

    if (!faculty || !major || !className || !subject) {
        showToast("Vui lòng nhập đầy đủ!");
        return;
    }

    if (editIndex === null) {
        academics.push({ faculty, major, class: className, subject });
        showToast("Thêm thành công!");
    } else {
        academics[editIndex] = { faculty, major, class: className, subject };
        editIndex = null;
        showToast("Cập nhật thành công!");
    }

    saveLocal();
    closeAcademic();
    renderAcademic();
}

// ===== EDIT =====
function editAcademic(index) {
    const item = academics[index];

    document.getElementById("faculty").value = item.faculty;
    document.getElementById("major").value = item.major;
    document.getElementById("classAcademic").value = item.class;
    document.getElementById("subject").value = item.subject;

    editIndex = index;
    openAcademic();
}

// ===== DELETE =====
function deleteAcademic(index) {
    if (confirm("Bạn chắc chắn muốn xóa?")) {
        academics.splice(index, 1);
        saveLocal();
        renderAcademic();
        showToast("Đã xóa!");
    }
}

// ===== IMPORT EXCEL =====
function handleExcelFile(file) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        let count = 0;

        json.forEach(row => {
            if (!row.Khoa && !row.faculty) return;

            academics.push({
                faculty: row.Khoa || row.faculty,
                major: row.Nganh || row.major,
                class: row.Lop || row.class,
                subject: row.Mon || row.subject
            });

            count++;
        });

        saveLocal();
        renderAcademic();
        showToast("Import thành công " + count + " dòng");
    };

    reader.readAsArrayBuffer(file);
}

// ===== LOAD =====
document.addEventListener("DOMContentLoaded", () => {

    renderAcademic();

    // SEARCH
    const search = document.getElementById("searchAcademic");
    if (search) {
        search.addEventListener("input", function () {
            const keyword = this.value.toLowerCase();

            const filtered = academics.filter(item =>
                item.faculty.toLowerCase().includes(keyword) ||
                item.major.toLowerCase().includes(keyword) ||
                item.class.toLowerCase().includes(keyword) ||
                item.subject.toLowerCase().includes(keyword)
            );

            renderAcademic(filtered);
        });
    }

    // ADD
    const btnAdd = document.getElementById("btnAddAcademic");
    if (btnAdd) {
        btnAdd.addEventListener("click", () => {
            editIndex = null;
            openAcademic();
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

            // confirm cho xịn
            if (confirm("Bạn có chắc muốn đăng xuất?")) {

                // xóa dữ liệu nếu cần
                localStorage.clear();

            }
        });
    }
});