const API = "http://127.0.0.1:8000/api";

function getAttendance() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Chưa đăng nhập");
        window.location.href = "../login/login.html";
        return;
    }

    fetch(`${API}/student/attendance`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/json"
        }
    })
    .then(async res => {
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Lỗi API");
        }

        return data;
    })
    .then(data => {
        console.log("ATTENDANCE:", data);

        // TODO: render ra UI
    })
    .catch(err => {
        console.error(err);
        alert("Lỗi lấy dữ liệu");
    });
}