document.addEventListener("DOMContentLoaded", function () {

    // SIDEBAR (GIỮ NGUYÊN)
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

    // LOAD DATA
    document.getElementById("phone").value =
        localStorage.getItem("phone") || "0123456789";

    document.getElementById("address").value =
        localStorage.getItem("address") || "123 Đường ABC, TP.HCM";

    const btnEdit = document.getElementById("btnEdit");
    const btnSave = document.getElementById("btnSave");
    const inputs = document.querySelectorAll(".editable");

    // BẬT EDIT
    btnEdit.onclick = () => {
        inputs.forEach(i => {
            i.disabled = false;
            i.classList.add("active");
        });

        btnSave.classList.remove("d-none");
    };

    // LƯU
    document.getElementById("formHoSo").onsubmit = function(e){
        e.preventDefault();

        if (!confirm("Bạn có chắc muốn lưu thay đổi?")) return;

        localStorage.setItem("phone", document.getElementById("phone").value);
        localStorage.setItem("address", document.getElementById("address").value);

        alert("✅ Đã lưu!");

        inputs.forEach(i => {
            i.disabled = true;
            i.classList.remove("active");
        });

        btnSave.classList.add("d-none");
    };

});