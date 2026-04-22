import { fetchWithAuth } from '../../../services/authService.js';

document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    setupEventListeners();
});

// 1. Tải thông tin hồ sơ từ API
async function loadProfile() {
    try {
        // Khớp với ProfileController.php: GET /api/student/profile
        const response = await fetchWithAuth('/student/profile');
        const profile = response.data.data;

        // Hiển thị lên các thẻ HTML (Dùng ID tương ứng trong HTML của bạn)
        document.getElementById('display-name').innerText = profile.name;
        document.getElementById('display-mssv').innerText = profile.student_code;
        document.getElementById('display-class').innerText = profile.cohort_class;
        document.getElementById('profile-avatar').innerText = profile.name.charAt(0).toUpperCase();

        // Điền vào form
        document.getElementById('name').value = profile.name;
        document.getElementById('student_code').value = profile.student_code;
        document.getElementById('email').value = profile.email;
        document.getElementById('date_of_birth').value = profile.date_of_birth;
        document.getElementById('gender').value = profile.gender === 'male' ? 'Nam' : 'Nữ';
        document.getElementById('phone_number').value = profile.phone_number || '';
        document.getElementById('cohort_class').value = profile.cohort_class || '';

    } catch (error) {
        console.error("Lỗi khi tải hồ sơ:", error);
        alert("Không thể tải thông tin hồ sơ cá nhân.");
    }
}

// 2. Thiết lập các sự kiện nút nhấn
function setupEventListeners() {
    const btnEdit = document.getElementById('btnEdit');
    const btnCancel = document.getElementById('btnCancel');
    const editActions = document.getElementById('edit-actions');
    const formHoSo = document.getElementById('formHoSo');
    const editableInputs = document.querySelectorAll('.editable');

    // Nút "Cập nhật thông tin"
    btnEdit.addEventListener('click', () => {
        editActions.classList.remove('d-none');
        btnEdit.classList.add('d-none');
        editableInputs.forEach(input => input.removeAttribute('readonly'));
        editableInputs[0].focus();
    });

    // Nút "Hủy bỏ"
    btnCancel.addEventListener('click', () => {
        editActions.classList.add('d-none');
        btnEdit.classList.remove('d-none');
        editableInputs.forEach(input => input.setAttribute('readonly', true));
        loadProfile(); // Tải lại dữ liệu cũ
    });

    // Sự kiện lưu thay đổi (Submit Form)
    formHoSo.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Dữ liệu khớp với hàm update() trong ProfileController.php
        const updateData = {
            phone_number: document.getElementById('phone_number').value,
            cohort_class: document.getElementById('cohort_class').value
        };

        try {
            // Khớp với ProfileController.php: PUT /api/student/profile
            const response = await fetchWithAuth('/student/profile', {
                method: 'PUT',
                data: updateData
            });

            if (response.data.success) {
                alert("Cập nhật thông tin thành công!");
                
                // Khóa lại các input
                editActions.classList.add('d-none');
                btnEdit.classList.remove('d-none');
                editableInputs.forEach(input => input.setAttribute('readonly', true));
                
                // Cập nhật lại giao diện
                loadProfile();
            }
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            const msg = error.response?.data?.message || "Có lỗi xảy ra khi lưu thông tin.";
            alert(msg);
        }
    });
}