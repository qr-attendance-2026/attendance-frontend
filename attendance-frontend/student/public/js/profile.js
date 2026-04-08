document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "https://api-attendance-backend-520975280881.asia-southeast1.run.app/api";
    const token = localStorage.getItem("token");

    // Load Sidebar
    fetch("../layout/sidebar.html").then(res => res.text()).then(data => {
        document.getElementById("sidebar-container").innerHTML = data;
        const current = window.location.pathname;
        document.querySelectorAll(".menu-item").forEach(link => {
            if (link.getAttribute("href") && current.includes(link.getAttribute("href"))) link.classList.add("active");
        });
    });

    async function loadProfile() {
        const response = await fetch(`${API_URL}/student/profile`, {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": "Bearer " + token }
        });

        if (response.ok) {
            const result = await response.json();
            const user = result.data;

            document.getElementById("leftName").innerText = user.name || "N/A";
            document.getElementById("leftId").innerText = user.student_code || "N/A";
            document.getElementById("leftClass").innerText = user.cohort_class || "D22_TH08";
            
            const avatar = document.querySelector(".avatar");
            if(avatar && user.name) avatar.innerText = user.name.split(" ").pop().charAt(0);

            document.getElementById("fullName").value = user.name || "";
            document.getElementById("studentCode").value = user.student_code || "";
            document.getElementById("className").value = user.cohort_class || "";
            document.getElementById("phone").value = user.phone_number || "";
            document.getElementById("address").value = user.address || "";
        }
    }

    // UPDATE DỮ LIỆU
    const form = document.getElementById("formHoSo");
    if(form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const res = await fetch(`${API_URL}/student/profile/update`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token 
                },
                body: JSON.stringify({
                    phone_number: document.getElementById("phone").value,
                    address: document.getElementById("address").value
                })
            });

            if (res.ok) {
                alert("✅ Đã cập nhật hồ sơ thành công!");
                location.reload();
            } else {
                alert("❌ Lỗi cập nhật!");
            }
        };
    }

    loadProfile();
});