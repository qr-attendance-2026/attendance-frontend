import { fetchWithAuth } from '../../../services/authService.js';
import "../../public/js/sidebar.js";

document.addEventListener("DOMContentLoaded", () => {
    fetchStudentQR();

    // 1. Hàm lấy QR và thông tin từ API
async function fetchStudentQR() {
    try {
        const [profileRes, qrRes] = await Promise.all([
            fetchWithAuth('/student/profile'),
            fetchWithAuth('/student/qr-code')
        ]);

        // profileRes và qrRes là axios responses
        if (profileRes.data?.success && qrRes.data?.success) {
            const user = profileRes.data.data;
            const qr = qrRes.data.data;

            document.getElementById('tenSV').innerText = user.name;
            document.getElementById('mssv').innerText = user.student_code;
            document.getElementById('lop').innerText = user.cohort_class || "HỆ THỐNG ĐIỂM DANH STU";

            // FIX: Kiểm tra URL hợp lệ
            let finalQrUrl = qr.qr_url;
            
            // Nếu URL bắt đầu bằng /storage mà data trả về lại có cả domain ngoài, 
            // ta cần làm sạch nó.
            if (finalQrUrl && finalQrUrl.includes('https://res.cloudinary.com')) {
                // Tách lấy phần URL Cloudinary thật nếu bị dính tiền tố localhost
                finalQrUrl = finalQrUrl.substring(finalQrUrl.indexOf('https://'));
            }

            const qrcodeContainer = document.getElementById("qrcode");
            if (qrcodeContainer && finalQrUrl) {
                // Thêm attribute crossorigin để html2canvas có thể đọc được ảnh từ Cloudinary
                qrcodeContainer.innerHTML = `<img src="${finalQrUrl}" alt="QR Code" style="width: 220px; height: 220px;" crossorigin="anonymous">`;
                window.currentQRUrl = finalQrUrl;
            }
        }
    } catch (error) {
        console.error("Lỗi tải thông tin QR:", error);
    }
}

    // 2. Hàm tải thẻ (Download) - Giữ nguyên logic html2canvas
    document.getElementById('btnDownload').onclick = function() {
        const area = document.getElementById('capture-area');
        const userCode = document.getElementById('mssv').innerText;
        
        html2canvas(area, {
            backgroundColor: "#fdfaf7",
            scale: 3, // Tăng lên 3 để in ấn sắc nét hơn
            useCORS: true // QUAN TRỌNG: Để html2canvas có thể vẽ được ảnh từ domain khác (server API)
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `SAMS_TheSV_${userCode}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        });
    };

    // 3. Hàm phóng to (Zoom)
document.getElementById('btnZoom').onclick = function() {
    const zoomContent = document.getElementById('zoomContent');
    if (window.currentQRUrl) {
        zoomContent.innerHTML = `<img src="${window.currentQRUrl}" style="width: 350px; height: 350px;" crossorigin="anonymous">`;
        const myModal = new bootstrap.Modal(document.getElementById('zoomModal'));
        myModal.show();
    }
};
});