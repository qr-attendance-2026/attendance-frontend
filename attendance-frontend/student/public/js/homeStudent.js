// Import sidebar.js từ thư mục public
import "../../public/js/sidebar.js"; 

document.addEventListener("DOMContentLoaded", () => {
    // Hiển thị tên sinh viên từ LocalStorage
    const studentName = localStorage.getItem('student_name') || "Sinh viên";
    const nameElement = document.getElementById("student-name");
    if (nameElement) nameElement.innerText = studentName;

    // Chạy đồng hồ
    const dongHo = document.getElementById("dongHo");
    if (dongHo) {
        setInterval(() => {
            dongHo.innerText = new Date().toLocaleTimeString("vi-VN");
        }, 1000);
    }

    // Kiểm tra Token bảo mật
    if (!localStorage.getItem('access_token')) {
        window.location.href = "/SAMS/index.html";
    }
});