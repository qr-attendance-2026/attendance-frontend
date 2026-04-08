const API_URL = "https://api-attendance-backend-520975280881.asia-southeast1.run.app/api";
let html5QrCode;
let isScanning = false;

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "../login.html"; return; }

    // 1. LOAD SIDEBAR
    fetch("../layout/sidebar.html").then(res => res.text()).then(data => {
        document.getElementById("sidebar-container").innerHTML = data;
        const current = window.location.pathname;
        document.querySelectorAll(".menu-item").forEach(link => {
            const href = link.getAttribute("href");
            if (href && current.includes(href)) link.classList.add("active");
        });
    });
});

function toggleCamera() {
    if (!isScanning) startScanner();
    else stopScanner();
}

function startScanner() {
    html5QrCode = new Html5Qrcode("reader");
    Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length > 0) {
            html5QrCode.start(
                { facingMode: "environment" }, // Ưu tiên camera sau
                { fps: 10, qrbox: 250 },
                (decodedText) => onScanSuccess(decodedText)
            );
            isScanning = true;
            document.getElementById("camera-off").style.display = "none";
            document.getElementById("scanEffect").classList.remove("d-none");

            let btn = document.getElementById("btnCamera");
            btn.innerText = "⛔ Tắt camera";
            btn.classList.replace("btn-danger", "btn-secondary");

            document.getElementById("statusBox").className = "alert alert-info";
            document.getElementById("statusBox").innerText = "Đang quét...";
        } else {
            alert("Không tìm thấy camera trên thiết bị!");
        }
    }).catch(err => alert("Không mở được camera: " + err));
}

function stopScanner() {
    if (html5QrCode && isScanning) {
        html5QrCode.stop().then(() => {
            isScanning = false;
            document.getElementById("camera-off").style.display = "block";
            document.getElementById("scanEffect").classList.add("d-none");

            let btn = document.getElementById("btnCamera");
            btn.innerText = "🎥 Bật camera";
            btn.classList.replace("btn-secondary", "btn-danger");

            document.getElementById("statusBox").className = "alert alert-secondary";
            document.getElementById("statusBox").innerText = "Đã tắt camera";
        }).catch(err => console.log("Lỗi tắt camera:", err));
    }
}

// HÀM QUAN TRỌNG: GỬI KẾT QUẢ QUÉT LÊN BACKEND CLOUD RUN
function onScanSuccess(qrText) {
    stopScanner(); // Tạm tắt cam sau khi quét trúng
    
    document.getElementById("statusBox").className = "alert alert-info";
    document.getElementById("statusBox").innerText = "Đang gửi dữ liệu điểm danh...";

    const token = localStorage.getItem("token");

    // Bắn API lên Cloud Run
    fetch(`${API_URL}/student/attendance/scan`, { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ qr_code: qrText })
    })
    .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Điểm danh thất bại");
        return data;
    })
    .then(data => {
        // Cập nhật giao diện thành công
        document.getElementById("statusBox").className = "alert alert-success";
        document.getElementById("statusBox").innerText = "Điểm danh thành công!";
        
        document.getElementById("qrContent").innerText = "Ghi nhận thành công lúc " + new Date().toLocaleTimeString();
        new bootstrap.Modal(document.getElementById('successModal')).show();
    })
    .catch(err => {
        // Báo lỗi
        document.getElementById("statusBox").className = "alert alert-danger";
        document.getElementById("statusBox").innerText = err.message;
        alert("Lỗi điểm danh: " + err.message);
    });
}