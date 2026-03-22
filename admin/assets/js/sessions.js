let sessions = [];

// render
function renderSessions() {
    const container = document.getElementById("sessionList");
    container.innerHTML = "";

    if (sessions.length === 0) {
        container.innerHTML = `<p>Chưa có buổi học</p>`;
        return;
    }

    sessions.forEach((s, index) => {
        container.innerHTML += `
        <div class="session-card">
            <h3>${s.name}</h3>
            <p>Phòng: ${s.room}</p>
            <p>Thời gian: ${s.time}</p>

            <img class="qr-img" src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${s.name}-${s.time}">

            <br><br>

            <button class="btn btn-danger" onclick="deleteSession(${index})">
                Xóa
            </button>
        </div>
        `;
    });
}

// modal
function openSession() {
    document.getElementById("modalSession").style.display = "flex";
}

function closeSession() {
    document.getElementById("modalSession").style.display = "none";
}

// save
function saveSession() {
    const name = document.getElementById("sessionName").value;
    const room = document.getElementById("sessionRoom").value;
    const start = document.getElementById("startTime").value;
    const end = document.getElementById("endTime").value;

    if (!name || !room || !start || !end) {
        alert("Nhập đầy đủ thông tin");
        return;
    }

    if (new Date(start) >= new Date(end)) {
        alert("Thời gian không hợp lệ!");
        return;
    }

    sessions.push({ name, room, start, end });

    closeSession();
    renderSessions();
}

// delete
function deleteSession(index) {
    if (confirm("Xóa buổi học?")) {
        sessions.splice(index, 1);
        renderSessions();
    }
}

// init
document.addEventListener("DOMContentLoaded", () => {
    renderSessions();

    document.getElementById("btnCreate").addEventListener("click", openSession);
});