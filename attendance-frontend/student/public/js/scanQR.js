import { fetchWithAuth } from '../../../services/authService.js';
import "../../public/js/sidebar.js";

let html5QrCode;
const btnCamera = document.getElementById('btnCamera');
const scanEffect = document.getElementById('scanEffect');
const cameraOff = document.getElementById('camera-off');
const statusBox = document.getElementById('statusBox');

const config = { fps: 15, qrbox: { width: 250, height: 250 } };

async function toggleCamera() {
    if (!html5QrCode || !html5QrCode.isScanning) {
        html5QrCode = new Html5Qrcode("reader");
        try {
            await html5QrCode.start(
                { facingMode: "environment" }, 
                config,
                onScanSuccess
            );
            btnCamera.innerHTML = `<i class="fas fa-stop me-2"></i> Tắt camera`;
            btnCamera.classList.replace("btn-brown", "btn-secondary");
            scanEffect.classList.remove('d-none');
            cameraOff.classList.add('d-none');
            
            statusBox.className = "status-badge status-scanning";
            statusBox.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i> Đang quét mã QR...`;
        } catch (err) {
            alert("Vui lòng cấp quyền truy cập camera!");
        }
    } else {
        await html5QrCode.stop();
        resetUI();
    }
}

function resetUI() {
    btnCamera.innerHTML = `<i class="fas fa-video me-2"></i> Bật camera`;
    btnCamera.classList.replace("btn-secondary", "btn-brown");
    scanEffect.classList.add('d-none');
    cameraOff.classList.remove('d-none');
    statusBox.className = "status-badge status-waiting";
    statusBox.innerHTML = `<i class="fas fa-info-circle me-1"></i> Hệ thống sẵn sàng`;
}

async function onScanSuccess(decodedText) {
    // 1. Ngừng camera ngay để tránh quét trùng 
    try {
        await html5QrCode.stop();
    } catch (e) { console.warn("Camera already stopped"); }

    scanEffect.classList.add('d-none');
    statusBox.className = "status-badge status-scanning";
    statusBox.innerHTML = `<i class="fas fa-sync fa-spin me-2"></i> Đang xử lý điểm danh...`;

    try {
        // 2. GỬI API ĐIỂM DANH (Sử dụng fetchWithAuth đã thống nhất)
        // Endpoint khớp với AttendanceController.php:
        const result = await fetchWithAuth('/student/attendance/check-in', {
            method: 'POST',
            body: { qr_payload: decodedText } // Key phải là qr_payload theo Controller
        });

        // result là axios response, body nằm trong result.data
        const body = result.data;

        if (body && body.success) {
            statusBox.className = "status-badge status-success";
            statusBox.innerHTML = `<i class="fas fa-check-circle me-2"></i> ${body.message || 'Điểm danh thành công!'}`;
            
            alert(body.message || "Chúc mừng! Bạn đã điểm danh thành công.");
            
            // 3. Chuyển hướng về trang lịch sử
            setTimeout(() => location.href = "../history/historyStudent.html", 1500);
        } else {
            alert(body.message || "Mã QR không hợp lệ!");
            resetUI();
        }
    } catch (error) {
        // Xử lý lỗi từ server (422, 403, v.v...)
        const errorMsg = error.response?.data?.message || "Lỗi kết nối server!";
        alert(errorMsg);
        resetUI();
    }
}

btnCamera.addEventListener('click', toggleCamera);