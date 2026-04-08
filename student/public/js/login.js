function login(){
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("pass").value.trim();

    if(!email || !pass){
        showToast("🙅‍♂️ Không được để trống!");
        return;
    }

    const btn = document.querySelector(".login-btn");
    btn.innerText = "ĐANG XÁC THỰC...";
    btn.style.background = "#444";

    fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: pass
        })
    })

    .then(async res => {
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Login fail");
        }

        return data;
    })

    .then(data => {
        console.log("LOGIN DATA:", data);

        const token = data.token || data.access_token;

        if(!token){
            showToast("❌ Không có token");
            return;
        }

        localStorage.setItem("token", token);

        showToast("✅ Đăng nhập thành công!");

        setTimeout(() => {
            window.location.href = "../student/views/student/profile.html";
        }, 800);
    })

    .catch(err => {
        console.error("LỖI:", err);
        showToast("❌ Không kết nối được backend");
    })

    .finally(() => {
        btn.innerText = "BẮT ĐẦU TRUY CẬP";
        btn.style.background = "#1a1a1a";
    });
}