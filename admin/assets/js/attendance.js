let attendanceList = [
    { 
        title: "Web Ca sáng",
        subject: "Lập trình Web", 
        session: "Ca 1", 
        time: "08:00",
        className: "CNTT1"
    },
    { 
        title: "DB Ca sáng",
        subject: "Cơ sở dữ liệu", 
        session: "Ca 2", 
        time: "09:30",
        className: "CNTT2"
    },
    { 
        title: "Java chiều",
        subject: "Java Web", 
        session: "Ca 3", 
        time: "13:00",
        className: "CNTT3"
    }
];

// HIỂN THỊ CARD
function renderAttendance() {
    const container = document.getElementById("attendanceList");
    container.innerHTML = "";

    attendanceList.forEach((item, index) => {
        container.innerHTML += `
        <div class="attendance-card" onclick="openDetail(${index})">

            <!-- BADGE -->
            <div class="badge">${item.session}</div>

            <!-- TÊN BUỔI -->
            <div class="attendance-title">
                ${item.title}
            </div>

            <!-- GIỜ -->
            <div class="attendance-time">
                ⏰ ${item.time}
            </div>

            <!-- MÔN -->
            <div class="attendance-subject">
                📘 ${item.subject}
            </div>

            <!-- LỚP -->
            <div class="attendance-session">
                👨‍🎓 ${item.className}
            </div>

        </div>
        `;
    });
}

// MỞ MODAL
function openDetail(index) {
    const item = attendanceList[index];

    document.getElementById("detailContent").innerHTML =
        `<b>${item.title}</b><br><br>
         📘 ${item.subject}<br>
         ⏰ ${item.time}<br>
         🕐 ${item.session}<br>
         👨‍🎓 ${item.className}`;

    document.getElementById("detailModal").style.display = "flex";
}

// ĐÓNG MODAL
function closeModal() {
    document.getElementById("detailModal").style.display = "none";
}

// LOAD
document.addEventListener("DOMContentLoaded", renderAttendance);