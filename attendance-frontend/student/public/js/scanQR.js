// student/views/student/scan-qr.js
import "../../public/js/sidebar.js"; 

let html5QrCode;
const btnCamera = document.getElementById('btnCamera');
const scanEffect = document.getElementById('scanEffect');
const cameraOff = document.getElementById('camera-off');
const statusBox = document.getElementById('statusBox');

// Cấu hình quét
const config = { fps: 10, qrbox: { width: 250, height: 250 } };

async function toggleCamera() {
    if (!html5QrCode || !html5QrCode.isScanning) {
        // BẬT CAMERA
        html5QrCode = new Html5Qrcode("reader");
        try {
            await html5QrCode.start(
                { facingMode: "environment" }, 
                config,
                onScanSuccess
            );
            btnCamera.innerText = "🛑 Tắt camera";
            btnCamera.classList.replace("btn-danger", "btn-secondary");
            scanEffect.classList.remove('d-none');
            cameraOff.classList.add('d-none');
            statusBox.innerText = "Đang quét...";
        } catch (err) {
            alert("Không thể truy cập camera!");
        }
    } else {
        // TẮT CAMERA
        await html5QrCode.stop();
        btnCamera.innerText = "🎥 Bật camera";
        btnCamera.classList.replace("btn-secondary", "btn-danger");
        scanEffect.classList.add('d-none');
        cameraOff.classList.remove('d-none');
        statusBox.innerText = "Camera đã tắt";
    }
}

function onScanSuccess(decodedText, decodedResult) {
    // Ngưng quét sau khi thành công
    html5QrCode.stop();
    
    statusBox.className = "alert alert-success d-inline-block";
    statusBox.innerText = "Quét thành công!";
    
    // Gửi dữ liệu điểm danh về Server (API của bạn)
    console.log("Mã QR:", decodedText);
    alert("Điểm danh thành công mã: " + decodedText);
    
    // Reset giao diện sau 2 giây
    setTimeout(() => location.reload(), 2000);
}

btnCamera.addEventListener('click', toggleCamera);