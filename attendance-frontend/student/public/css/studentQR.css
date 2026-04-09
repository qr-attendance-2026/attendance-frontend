import "../../public/js/sidebar.js";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Lấy thông tin từ localStorage
    const userName = localStorage.getItem('student_name') || "Sinh viên";
    const userCode = localStorage.getItem('student_code') || "MSSV-UNKNOWN";

    // Đổ dữ liệu ra giao diện
    document.getElementById('tenSV').innerText = userName;
    document.getElementById('mssv').innerText = userCode;

    // 2. Tạo mã QR dựa trên MSSV
    const qrcodeContainer = document.getElementById("qrcode");
    const qrGenerator = new QRCode(qrcodeContainer, {
        text: userCode, // Dữ liệu mã hóa vào QR
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    // 3. Hàm tải thẻ (Download)
    document.getElementById('btnDownload').onclick = function() {
        const area = document.getElementById('capture-area');
        html2canvas(area).then(canvas => {
            const link = document.createElement('a');
            link.download = `TheSV_${userCode}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    };

    // 4. Hàm phóng to (Zoom)
    document.getElementById('btnZoom').onclick = function() {
        const zoomContent = document.getElementById('zoomContent');
        zoomContent.innerHTML = ""; // Xóa nội dung cũ
        
        // Tạo lại QR to hơn trong Modal
        new QRCode(zoomContent, {
            text: userCode,
            width: 400,
            height: 400
        });

        const myModal = new bootstrap.Modal(document.getElementById('zoomModal'));
        myModal.show();
    };
});