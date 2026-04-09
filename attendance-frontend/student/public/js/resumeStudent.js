// student/views/student/ho-so.js
import "../../public/js/sidebar.js";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Lấy dữ liệu từ localStorage
    const userName = localStorage.getItem('student_name') || 'Sinh viên';
    const studentCode = localStorage.getItem('student_code') || 'Chưa cập nhật';

    // 2. Điền dữ liệu vào giao diện
    document.getElementById('display-name').innerText = userName;
    document.getElementById('full-name').value = userName;
    document.getElementById('display-mssv').innerText = studentCode;
    document.getElementById('student-code').value = studentCode;

    // Tạo Avatar chữ cái đầu
    const avatarEl = document.getElementById('profile-avatar');
    const parts = userName.trim().split(' ');
    avatarEl.innerText = parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0][0].toUpperCase();

    // 3. Xử lý Chỉnh sửa
    const btnEdit = document.getElementById('btnEdit');
    const btnCancel = document.getElementById('btnCancel');
    const actionButtons = document.getElementById('action-buttons');
    const editableInputs = document.querySelectorAll('.editable');

    btnEdit.onclick = () => {
        editableInputs.forEach(input => input.disabled = false);
        actionButtons.classList.remove('d-none');
        btnEdit.classList.add('d-none');
        editableInputs[0].focus();
    };

    btnCancel.onclick = () => {
        editableInputs.forEach(input => input.disabled = true);
        actionButtons.classList.add('d-none');
        btnEdit.classList.remove('d-none');
    };

    // 4. Xử lý Lưu (Giả lập)
    document.getElementById('formHoSo').onsubmit = (e) => {
        e.preventDefault();
        alert("Thông tin đã được cập nhật thành công!");
        btnCancel.click();
    };
});