// ===== DATA =====
let lecturers = JSON.parse(localStorage.getItem("lecturers")) || [
    { id: "GV01", name: "Trần Văn B", subject: "Lập trình Web" }
];

let editIndex = null;

// ===== SAVE LOCAL =====
function saveLocal() {
    localStorage.setItem("lecturers", JSON.stringify(lecturers));
}

// ===== TOAST =====
function showToast(msg) {
    const t = document.getElementById("toast");
    t.innerText = msg;
    t.style.display = "block";
    setTimeout(() => t.style.display = "none", 2000);
}

// ===== RENDER =====
function renderTable(data = lecturers) {
    const tbody = document.querySelector("#lecturerTable tbody");
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

    data.forEach((gv, index) => {
        tbody.innerHTML += `
        <tr>
            <td>${gv.id}</td>
            <td>${gv.name}</td>
            <td>${gv.subject}</td>
            <td>
                <button class="btn btn-primary" onclick="openEdit(${index})">✏️</button>
                <button class="btn btn-danger" onclick="deleteLecturer(${index})">🗑️</button>
            </td>
        </tr>`;
    });
}

// ===== ADD =====
function addLecturer() {
    editIndex = null;

    document.getElementById("magv").value = "";
    document.getElementById("name").value = "";
    document.getElementById("subject").value = "";

    document.getElementById("modal").style.display = "flex";
}

// ===== EDIT =====
function openEdit(index) {
    editIndex = index;
    const gv = lecturers[index];

    document.getElementById("magv").value = gv.id;
    document.getElementById("name").value = gv.name;
    document.getElementById("subject").value = gv.subject;

    document.getElementById("modal").style.display = "flex";
}

// ===== SAVE =====
function saveLecturer() {
    const id = document.getElementById("magv").value.trim();
    const nameVal = document.getElementById("name").value.trim();
    const subjectVal = document.getElementById("subject").value.trim();

    if (!id || !nameVal || !subjectVal) {
        showToast("Vui lòng nhập đầy đủ!");
        return;
    }

    if (editIndex === null) {
        lecturers.push({ id, name: nameVal, subject: subjectVal });
        showToast("Thêm thành công!");
    } else {
        lecturers[editIndex] = { id, name: nameVal, subject: subjectVal };
        showToast("Cập nhật thành công!");
    }

    saveLocal();
    closeModal();
    renderTable();
}

// ===== CLOSE =====
function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// ===== DELETE =====
function deleteLecturer(index) {
    if (confirm("Bạn có chắc muốn xóa?")) {
        lecturers.splice(index, 1);
        saveLocal();
        renderTable();
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
            if (!row.MaGV && !row.id) return;

            lecturers.push({
                id: row.MaGV || row.id,
                name: row.Ten || row.name,
                subject: row.Mon || row.subject
            });

            count++;
        });

        saveLocal();
        renderTable();
        showToast("Import thành công " + count + " dòng");
    };

    reader.readAsArrayBuffer(file);
}

// ===== LOAD =====
document.addEventListener("DOMContentLoaded", () => {
    renderTable();

    // SEARCH
    const search = document.getElementById("search");
    if (search) {
        search.addEventListener("input", function () {
            const k = this.value.toLowerCase();

            renderTable(lecturers.filter(g =>
                g.id.toLowerCase().includes(k) ||
                g.name.toLowerCase().includes(k) ||
                g.subject.toLowerCase().includes(k)
            ));
        });
    }

    // ADD BUTTON
    const btnAdd = document.getElementById("btnAdd");
    if (btnAdd) {
        btnAdd.addEventListener("click", addLecturer);
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