document.addEventListener("DOMContentLoaded", function () {
    // 1. LOAD SIDEBAR (Giữ nguyên logic gốc của bạn)
   fetch("../layout/sidebar.html")
.then(res => res.text())
.then(data => {
    document.getElementById("sidebar-container").innerHTML = data;

    // 🔥 FIX ACTIVE MENU
    const current = window.location.pathname;

    document.querySelectorAll(".menu-item").forEach(link => {
        const href = link.getAttribute("href");

        if (href && current.includes(href)) {
            link.classList.add("active");
        }
    });
})
.catch(err => console.log("Lỗi load sidebar"));
    // 2. DỮ LIỆU
    const mssv = "DH52201348";
    const ten = "Lê Thị Mỹ Quỳnh";
    const lop = "D22_TH08";
    
    document.getElementById("tenSV").innerText = ten;
    document.getElementById("mssv").innerText = mssv;
    document.getElementById("lop").innerText = "Lớp: " + lop;

    // 3. TẠO MÃ QR
    new QRCode(document.getElementById("qrcode"), {
        text: mssv,
        width: 220,
        height: 220,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
});

// HÀM TẢI TOÀN BỘ KHUNG THẺ
function downloadFullCard() {
    const card = document.getElementById("capture-area");
    
    // Chụp lại vùng thẻ sinh viên
    html2canvas(card, {
        scale: 2, // Tăng chất lượng ảnh
        backgroundColor: "#ffffff" 
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = "The_Sinh_Vien_Quynh.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}

// HÀM PHÓNG TO (Dùng lại logic cũ của bạn)
function zoomQR() {
    const card = document.getElementById("capture-area");

    // clone lại toàn bộ thẻ (giữ nguyên QR + info)
    const clone = card.cloneNode(true);

    // clear modal
    const zoomBox = document.getElementById("zoomContent");
    zoomBox.innerHTML = "";
    zoomBox.appendChild(clone);

    // scale to đẹp hơn
    clone.style.transform = "scale(1.5)";
    clone.style.transformOrigin = "center";

    new bootstrap.Modal(document.getElementById("zoomModal")).show();
}