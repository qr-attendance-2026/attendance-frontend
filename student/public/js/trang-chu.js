// đồng hồ realtime
function capNhatGio() {
    const now = new Date();
    document.getElementById("dongHo").innerText =
        now.toLocaleTimeString("vi-VN");
}
setInterval(capNhatGio, 1000);

// countdown demo (5 phút)
let time = 300;

function updateCountdown() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    document.getElementById("countdown").innerText =
        `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    if (time > 0) time--;
}

setInterval(updateCountdown, 1000);