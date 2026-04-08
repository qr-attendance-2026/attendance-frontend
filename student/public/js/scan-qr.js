// SIDEBAR
fetch("../layout/sidebar.html")
.then(res => res.text())
.then(data => {
    document.getElementById("sidebar-container").innerHTML = data;

    const current = window.location.pathname;

    document.querySelectorAll(".menu-item").forEach(link => {
        const href = link.getAttribute("href");

        if (href && current.includes(href)) {
            link.classList.add("active");
        }
    });
});


let html5QrCode;
let isScanning = false;

function toggleCamera() {
    if (!isScanning) startScanner();
    else stopScanner();
}

function startScanner() {

    html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras().then(devices => {

        html5QrCode.start(
            devices[0].id,
            {
                fps: 10,
                qrbox: 250
            },
            (decodedText) => onScanSuccess(decodedText)
        );

        isScanning = true;

        // ẨN placeholder
        document.getElementById("camera-off").style.display = "none";

        // HIỆN EFFECT
        document.getElementById("scanEffect").classList.remove("d-none");

        // đổi nút
        let btn = document.getElementById("btnCamera");
        btn.innerText = "⛔ Tắt camera";
        btn.classList.replace("btn-danger", "btn-secondary");

        document.getElementById("statusBox").className = "alert alert-info";
        document.getElementById("statusBox").innerText = "Đang quét...";
    })
    .catch(() => alert("Không mở được camera!"));
}

function stopScanner() {

    html5QrCode.stop().then(() => {

        isScanning = false;

        // HIỆN lại placeholder
        document.getElementById("camera-off").style.display = "block";

        // ẨN EFFECT
        document.getElementById("scanEffect").classList.add("d-none");

        let btn = document.getElementById("btnCamera");
        btn.innerText = "🎥 Bật camera";
        btn.classList.replace("btn-secondary", "btn-danger");

        document.getElementById("statusBox").className = "alert alert-secondary";
        document.getElementById("statusBox").innerText = "Đã tắt camera";
    });
}

function onScanSuccess(qrText) {

    stopScanner();

    document.getElementById("statusBox").className = "alert alert-success";
    document.getElementById("statusBox").innerText = "Quét thành công!";

    document.getElementById("qrContent").innerText = qrText;

    new bootstrap.Modal(document.getElementById('successModal')).show();
}