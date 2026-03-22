// DATA
let students = [
    { id: "SV01", name: "Nguyễn Văn A", class: "CNTT1" }
];

let editIndex = null;

// HIỂN THỊ
function renderStudents() {
  const table = document.getElementById("studentTable");
  table.innerHTML = "";

  students.forEach((s, index) => {
    table.innerHTML += `
      <tr>
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.class}</td>
        <td>${s.email}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-primary" onclick="editStudent(${index})">Sửa</button>
            <button class="btn btn-danger" onclick="deleteStudent(${index})">Xóa</button>
          </div>
        </td>
      </tr>
    `;
  });
}

// MỞ MODAL THÊM
function addStudent() {
    editIndex = null;
    document.getElementById("modalTitle").innerText = "Thêm sinh viên";

    document.getElementById("mssv").value = "";
    document.getElementById("name").value = "";
    document.getElementById("class").value = "";

    document.getElementById("modal").style.display = "flex";
}

// MỞ MODAL SỬA
function openEdit(index) {
    editIndex = index;
    const sv = students[index];

    document.getElementById("modalTitle").innerText = "Sửa sinh viên";

    document.getElementById("mssv").value = sv.id;
    document.getElementById("name").value = sv.name;
    document.getElementById("class").value = sv.class;

    document.getElementById("modal").style.display = "flex";
}

// LƯU
function saveStudent() {
    const id = document.getElementById("mssv").value;
    const name = document.getElementById("name").value;
    const className = document.getElementById("class").value;

    if (!id || !name || !className) {
        alert("Vui lòng nhập đầy đủ!");
        return;
    }

    if (editIndex === null) {
        students.push({ id, name, class: className });
    } else {
        students[editIndex] = { id, name, class: className };
    }

    closeModal();
    renderTable();
}

// ĐÓNG MODAL
function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// XÓA
function deleteStudent(index) {
    if (confirm("Bạn có chắc muốn xóa?")) {
        students.splice(index, 1);
        renderTable();
    }
}

// SEARCH + LOAD
document.addEventListener("DOMContentLoaded", () => {
    renderTable();

    document.getElementById("search").addEventListener("input", function () {
        const keyword = this.value.toLowerCase();
        const tbody = document.querySelector("#studentTable tbody");

        const filtered = students.filter(sv =>
            sv.id.toLowerCase().includes(keyword) ||
            sv.name.toLowerCase().includes(keyword) ||
            sv.class.toLowerCase().includes(keyword)
        );

        // nếu không có dữ liệu
        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center;color:#f87171;">
                        Sinh viên không tồn tại
                    </td>
                </tr>
            `;
        } else {
            renderTable(filtered);
        }
    });

    document.getElementById("btnAdd").addEventListener("click", addStudent);
});
function goBack() {
    window.location.href = "../index.html";
}