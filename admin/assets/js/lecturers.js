// ===== DATA =====
let lecturers = [
    { id: "GV01", name: "Trần Văn B", subject: "Lập trình Web" }
];

let editIndex = null;

// ===== HIỂN THỊ =====
function renderTable(data = lecturers) {
    const tbody = document.querySelector("#lecturerTable tbody");
    tbody.innerHTML = "";

    data.forEach((gv, index) => {
        tbody.innerHTML += `
        <tr>
            <td>${gv.id}</td>
            <td>${gv.name}</td>
            <td>${gv.subject}</td>
            <td>
                <button class="btn btn-primary" onclick="openEdit(${index})">Sửa</button>
                <button class="btn btn-danger" onclick="deleteLecturer(${index})">Xóa</button>
            </td>
        </tr>`;
    });
}

// ===== MỞ MODAL THÊM =====
function addLecturer() {
    editIndex = null;
    document.getElementById("modalTitle").innerText = "Thêm giảng viên";

    document.getElementById("magv").value = "";
    document.getElementById("name").value = "";
    document.getElementById("subject").value = "";

    document.getElementById("modal").style.display = "flex";
}

// ===== MỞ MODAL SỬA =====
function openEdit(index) {
    editIndex = index;
    const gv = lecturers[index];

    document.getElementById("modalTitle").innerText = "Sửa giảng viên";

    document.getElementById("magv").value = gv.id;
    document.getElementById("name").value = gv.name;
    document.getElementById("subject").value = gv.subject;

    document.getElementById("modal").style.display = "flex";
}

// ===== LƯU =====
function saveLecturer() {
    const id = document.getElementById("magv").value.trim();
    const name = document.getElementById("name").value.trim();
    const subject = document.getElementById("subject").value.trim();

    if (!id || !name || !subject) {
        alert("Vui lòng nhập đầy đủ!");
        return;
    }

    if (editIndex === null) {
        lecturers.push({ id, name, subject });
    } else {
        lecturers[editIndex] = { id, name, subject };
    }

    closeModal();
    renderTable();
}

// ===== ĐÓNG MODAL =====
function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// ===== XÓA =====
function deleteLecturer(index) {
    if (confirm("Bạn có chắc muốn xóa?")) {
        lecturers.splice(index, 1);
        renderTable();
    }
}

// ===== SEARCH + LOAD =====
document.addEventListener("DOMContentLoaded", () => {
    renderTable();

    document.getElementById("search").addEventListener("input", function () {
        const keyword = this.value.toLowerCase();
        const tbody = document.querySelector("#lecturerTable tbody");

        const filtered = lecturers.filter(gv =>
            gv.id.toLowerCase().includes(keyword) ||
            gv.name.toLowerCase().includes(keyword) ||
            gv.subject.toLowerCase().includes(keyword)
        );

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center;color:#999;">
                        Giảng viên không tồn tại
                    </td>
                </tr>
            `;
        } else {
            renderTable(filtered);
        }
    });

    document.getElementById("btnAdd").addEventListener("click", addLecturer);
});

// ===== BACK =====
function goBack() {
    window.location.href = "../index.html";
}