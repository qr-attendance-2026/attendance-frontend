// ===== LẤY DATA =====
// ưu tiên lấy từ localStorage (nếu có), nếu không thì dùng data mẫu
let students = JSON.parse(localStorage.getItem("students")) || [
  { id: "SV01", name: "A", class: "CNTT1", status: "present" },
  { id: "SV02", name: "B", class: "CNTT1", status: "absent" },
  { id: "SV03", name: "C", class: "CNTT2", status: "present" },
  { id: "SV04", name: "D", class: "CNTT2", status: "present" }
];

// ===== UPDATE DASHBOARD =====
function updateDashboard() {

  const total = students.length;

  // lấy danh sách lớp không trùng
  const classes = [...new Set(students.map(s => s.class))];

  // tính tỷ lệ có mặt
  const present = students.filter(s => s.status === "present").length;
  const rate = total ? Math.round((present / total) * 100) : 0;

  // update UI (nếu tồn tại)
  const elTotal = document.getElementById("totalStudents");
  const elClass = document.getElementById("totalClasses");
  const elRate = document.getElementById("attendanceRate");

  if (elTotal) elTotal.innerText = total;
  if (elClass) elClass.innerText = classes.length;
  if (elRate) elRate.innerText = rate + "%";
}

// ===== DATA CHART =====
function getChartData() {
  const days = ['T2', 'T3', 'T4', 'T5', 'T6'];

  // demo: mỗi ngày dao động theo số SV có mặt
  const present = students.filter(s => s.status === "present").length;

  return days.map(() => present + Math.floor(Math.random() * 5));
}

// ===== INIT CHART =====
function initChart() {
  const canvas = document.getElementById("chart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // gradient đẹp
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(59,130,246,0.4)');
  gradient.addColorStop(1, 'rgba(59,130,246,0.05)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['T2', 'T3', 'T4', 'T5', 'T6'],
      datasets: [{
        label: 'Điểm danh',
        data: getChartData(),

        borderColor: '#3b82f6',
        backgroundColor: gradient,

        fill: true,
        tension: 0.5,

        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#fff',
          bodyColor: '#cbd5f5',
          padding: 10,
          cornerRadius: 8
        }
      },

      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#64748b' }
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { color: '#64748b' }
        }
      }
    }
  });
}

// ===== LOAD =====
document.addEventListener("DOMContentLoaded", () => {
  updateDashboard();
  initChart();
});


// ===== LOGOUT =====
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {

            // confirm cho xịn
            if (confirm("Bạn có chắc muốn đăng xuất?")) {

                // xóa dữ liệu nếu cần
                localStorage.clear();
            }
        });
    }
});