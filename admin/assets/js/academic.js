let academics = [
    { faculty: "CNTT", major: "Công nghệ thông tin", class: "D22_TH01", subject: "Lập trình Web" }
];

let editIndex = null;

// render
function renderAcademic(data = academics) {
    const tbody = document.querySelector("#academicTable tbody");
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;color:#f87171">
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
                <button class="btn btn-primary" onclick="editAcademic(${index})">Sửa</button>
                <button class="btn btn-danger" onclick="deleteAcademic(${index})">Xóa</button>
            </td>
        </tr>
        `;
    });
}

// modal
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

// thêm / sửa
function saveAcademic() {
    const faculty = document.getElementById("faculty").value;
    const major = document.getElementById("major").value;
    const className = document.getElementById("classAcademic").value;
    const subject = document.getElementById("subject").value;

    if (!faculty || !major || !className || !subject) {
        alert("Vui lòng nhập đầy đủ");
        return;
    }

    if (editIndex === null) {
        academics.push({ faculty, major, class: className, subject });
    } else {
        academics[editIndex] = { faculty, major, class: className, subject };
        editIndex = null;
    }

    closeAcademic();
    renderAcademic();
}

// sửa
function editAcademic(index) {
    const item = academics[index];

    document.getElementById("faculty").value = item.faculty;
    document.getElementById("major").value = item.major;
    document.getElementById("classAcademic").value = item.class;
    document.getElementById("subject").value = item.subject;

    editIndex = index;
    openAcademic();
}

// xóa
function deleteAcademic(index) {
    if (confirm("Bạn chắc chắn muốn xóa?")) {
        academics.splice(index, 1);
        renderAcademic();
    }
}

// search
document.addEventListener("DOMContentLoaded", () => {

    renderAcademic();

    document.getElementById("searchAcademic").addEventListener("input", function () {
        const keyword = this.value.toLowerCase();

        const filtered = academics.filter(item =>
            item.faculty.toLowerCase().includes(keyword) ||
            item.major.toLowerCase().includes(keyword) ||
            item.class.toLowerCase().includes(keyword) ||
            item.subject.toLowerCase().includes(keyword)
        );

        renderAcademic(filtered);
    });

    document.getElementById("btnAddAcademic").addEventListener("click", () => {
        editIndex = null;
        openAcademic();
    });
});