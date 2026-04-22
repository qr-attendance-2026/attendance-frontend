// import { teacherService } from './teacherService.js';
// let currentSessionId = null;
// let pollInterval = null;
// let html5QrCode = null;

// const overlay = document.getElementById('qrOverlay');
// const qrcodeDiv = document.getElementById('qrcode');
// const qrGenerator = new QRCode(qrcodeDiv, { width: 250, height: 250 });
// const scanResult = document.getElementById('scan-result');

// // 1. Mở phiên và hiển thị mã QR
// document.getElementById('btn-open-session').addEventListener('click', async () => {
//     const classId = document.getElementById('class-id').value;
//     const checkNumber = document.getElementById('check-number').value;
//     const duration = document.getElementById('duration').value;

//     if (!classId) return alert('Vui lòng nhập Class ID');

//     try {
//         const res = await teacherService.generateQR(classId, checkNumber, duration);
//         if (res.success) {
//             currentSessionId = res.data.session_id;
            
//             // Hiển thị Overlay QR cho cả lớp quét
//             document.getElementById('overlay-class-info').innerText = `Mã lớp: ${res.data.class_code} | Lần: ${res.data.check_number}`;
//             document.getElementById('display-expiry').innerText = new Date(res.data.qr_expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//             qrGenerator.clear();
//             qrGenerator.makeCode(res.data.qr_payload);
//             overlay.style.display = 'flex';

//             startPolling(); // Bắt đầu cập nhật danh sách tự động
//         }
//     } catch (err) {
//         alert(err.response?.data?.message || 'Lỗi server');
//     }
// });

// // 2. Logic Quét mã Camera cho Giảng viên
// document.getElementById('btn-toggle-camera').addEventListener('click', async () => {
//     if (!currentSessionId) return alert('Bạn cần tạo phiên điểm danh trước!');

//     const btn = document.getElementById('btn-toggle-camera');

//     if (!html5QrCode) {
//         html5QrCode = new Html5Qrcode("reader");
//         btn.innerText = "DỪNG CAMERA";
//         btn.classList.replace('btn-dark', 'btn-danger');

//         try {
//             await html5QrCode.start(
//                 { facingMode: "environment" },
//                 { fps: 10, qrbox: { width: 250, height: 250 } },
//                 async (decodedText) => {
//                     // Xử lý khi quét thành công MSSV (Mã sinh viên)
//                     scanResult.innerHTML = `<span class="badge bg-primary">Đang quét: ${decodedText}</span>`;
                    
//                     try {
//                         // Gọi API scan từ AttendanceController.php
//                         const res = await teacherService.scanStudent(currentSessionId, decodedText);
//                         if (res.success) {
//                             scanResult.innerHTML = `<span class="badge bg-success">✅ ${res.data.name} thành công!</span>`;
//                             updateAttendanceList(); // Cập nhật bảng ngay
//                         }
//                     } catch (err) {
//                         scanResult.innerHTML = `<span class="badge bg-danger">❌ ${err.response?.data?.message || 'Lỗi'}</span>`;
//                     }
//                 }
//             );
//         } catch (err) {
//             alert("Không thể khởi động camera.");
//             stopScanner();
//         }
//     } else {
//         stopScanner();
//     }
// });

// function stopScanner() {
//     if (html5QrCode) {
//         html5QrCode.stop().then(() => {
//             html5QrCode = null;
//             const btn = document.getElementById('btn-toggle-camera');
//             btn.innerText = "BẬT CAMERA QUÉT";
//             btn.classList.replace('btn-danger', 'btn-dark');
//             scanResult.innerHTML = "";
//             document.getElementById('reader').innerHTML = "";
//         });
//     }
// }

// // 3. Cập nhật danh sách (Polling)
// function startPolling() {
//     if (pollInterval) clearInterval(pollInterval);
//     updateAttendanceList();
//     pollInterval = setInterval(updateAttendanceList, 4000);
// }

// async function updateAttendanceList() {
//     if (!currentSessionId) return;
//     try {
//         const res = await teacherService.getAttendanceStatus(currentSessionId);
//         if (res.success) {
//             const tbody = document.getElementById('attendance-list');
//             const students = res.data.students;
//             let count = 0;

//             tbody.innerHTML = students.map(s => {
//                 const isPresent = s.status === 'present';
//                 if (isPresent) count++;
//                 return `
//                     <tr class="${isPresent ? 'table-success' : ''}">
//                         <td class="ps-4 fw-bold">${s.student_code}</td>
//                         <td>${s.name}</td>
//                         <td>${s.checked_at ? new Date(s.checked_at).toLocaleTimeString() : '-'}</td>
//                         <td class="pe-4 text-end">
//                             <span class="badge ${isPresent ? 'bg-success' : 'bg-light text-dark border'}">
//                                 ${isPresent ? 'Đã có mặt' : 'Vắng'}
//                             </span>
//                         </td>
//                     </tr>`;
//             }).join('');
//             document.getElementById('live-count').innerText = `${count} / ${students.length}`;
//         }
//     } catch (e) { console.error("Update list error", e); }
// }

// document.getElementById('btn-close-overlay').onclick = () => overlay.style.display = 'none';




import { teacherService } from "./teacherService.js";

let currentSessionId = null;
let pollInterval = null;
let html5QrCode = null;

const overlay = document.getElementById("qrOverlay");
const qrcodeDiv = document.getElementById("qrcode");
const scanResult = document.getElementById("scan-result");

const qrGenerator = new QRCode(qrcodeDiv, {
    width: 250,
    height: 250
});


// =============================
// TẠO QR SESSION
// =============================

document.getElementById("btn-open-session").addEventListener("click", async () => {

    const classId = document.getElementById("class-id").value;
    const checkNumber = document.getElementById("check-number").value;
    const duration = document.getElementById("duration").value;

    if (!classId) {
        alert("Vui lòng nhập Class ID");
        return;
    }

    try {

const res = await teacherService.openSession(classId, checkNumber, duration);

if (res.success) {

    currentSessionId = res.data.session_id;

            document.getElementById("overlay-class-info").innerText =
                `Mã lớp: ${res.data.class_code} | Lần: ${res.data.check_number}`;

            document.getElementById("display-expiry").innerText =
                new Date(res.data.qr_expires_at).toLocaleTimeString();

            qrGenerator.clear();
            qrGenerator.makeCode(res.data.qr_payload);

            overlay.style.display = "flex";

            startPolling();
        }

    } catch (err) {

        alert(err.message || "Lỗi server");

    }

});


// =============================
// CAMERA SCAN
// =============================

document.getElementById("btn-toggle-camera").addEventListener("click", async () => {

    if (!currentSessionId) {
        alert("Bạn phải mở phiên trước");
        return;
    }

    const btn = document.getElementById("btn-toggle-camera");

    if (!html5QrCode) {

        html5QrCode = new Html5Qrcode("reader");

        btn.innerText = "DỪNG CAMERA";
        btn.classList.replace("btn-dark", "btn-danger");

        await html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },

            async (decodedText) => {

                scanResult.innerHTML =
                    `<span class="badge bg-primary">Đang quét ${decodedText}</span>`;

                try {

                    const res = await teacherService.scanStudent(currentSessionId, decodedText);

                    if (res.success) {

                        scanResult.innerHTML =
                            `<span class="badge bg-success">✅ ${res.data.name}</span>`;

                        updateAttendanceList();

                    }

                } catch (err) {

                    scanResult.innerHTML =
                        `<span class="badge bg-danger">❌ ${err.message}</span>`;

                }

            }

        );

    } else {

        stopScanner();

    }

});


function stopScanner() {

    if (!html5QrCode) return;

    html5QrCode.stop().then(() => {

        html5QrCode = null;

        const btn = document.getElementById("btn-toggle-camera");

        btn.innerText = "BẬT CAMERA QUÉT";
        btn.classList.replace("btn-danger", "btn-dark");

        document.getElementById("reader").innerHTML = "";
        scanResult.innerHTML = "";

    });

}



// =============================
// REALTIME LIST
// =============================

function startPolling() {

    if (pollInterval) clearInterval(pollInterval);

    updateAttendanceList();

    pollInterval = setInterval(updateAttendanceList, 4000);

}



async function updateAttendanceList() {

    if (!currentSessionId) return;

    try {

const res = await teacherService.getLive(currentSessionId);


        if (!res.success) return;

        const students = res.data.students;

        const tbody = document.getElementById("attendance-list");

        let count = 0;

        tbody.innerHTML = students.map(s => {

            const present = s.status === "present";

            if (present) count++;

            return `
                <tr class="${present ? "table-success" : ""}">
                    <td class="ps-4 fw-bold">${s.student_code}</td>
                    <td>${s.name}</td>
                    <td>${s.checked_at ? new Date(s.checked_at).toLocaleTimeString() : "-"}</td>
                    <td class="text-end pe-4">
                        <span class="badge ${present ? "bg-success" : "bg-light text-dark border"}">
                            ${present ? "Đã có mặt" : "Vắng"}
                        </span>
                    </td>
                </tr>
            `;

        }).join("");

        document.getElementById("live-count").innerText =
            `${count} / ${students.length}`;

    } catch (err) {

        console.error("Update list error", err);

    }

}



document.getElementById("btn-close-overlay").onclick = () => {
    overlay.style.display = "none";
};