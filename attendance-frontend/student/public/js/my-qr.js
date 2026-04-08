document.addEventListener("DOMContentLoaded", async function () {
    const API_URL = "https://api-attendance-backend-520975280881.asia-southeast1.run.app/api";
    const token = localStorage.getItem("token");

    // 1. LOAD SIDEBAR
    fetch("../layout/sidebar.html").then(res => res.text()).then(data => {
        document.getElementById("sidebar-container").innerHTML = data;
        const current = window.location.pathname;
        document.querySelectorAll(".menu-item").forEach(link => {
            const href = link.getAttribute("href");
            if (href && current.includes(href)) link.classList.add("active");
        });
    });

    // 2. LẤY DỮ LIỆU TỪ CLOUD RUN VÀ TẠO QR
    try {
        const res = await fetch(`${API_URL}/student/profile`, {
            headers: { "Authorization": "Bearer " + token }
        });
        if (res.ok) {
            const result = await res.json();
            const user = result.data;

            document.getElementById("tenSV").innerText = user.name;
            document.getElementById("mssv").innerText = user.student_code;
            document.getElementById("lop").innerText = "Lớp: " + (user.cohort_class || "D22_TH08");

            new QRCode(document.getElementById("qrcode"), {
                text: user.student_code,
                width: 220,
                height: 220,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }
    } catch (err) { console.error("Lỗi:", err); }
});

// HÀM TẢI TOÀN BỘ KHUNG THẺ (CỦA BẠN)
function downloadFullCard() {
    const card = document.getElementById("capture-area");
    html2canvas(card, {
        scale: 2, 
        backgroundColor: "#ffffff" 
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = "The_Sinh_Vien_STU.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}

// HÀM PHÓNG TO (CỦA BẠN)
function zoomQR() {
    const card = document.getElementById("capture-area");
    const clone = card.cloneNode(true);
    const zoomBox = document.getElementById("zoomContent");
    
    zoomBox.innerHTML = "";
    zoomBox.appendChild(clone);
    clone.style.transform = "scale(1.5)";
    clone.style.transformOrigin = "center";

    new bootstrap.Modal(document.getElementById("zoomModal")).show();
}