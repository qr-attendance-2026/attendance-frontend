document.addEventListener("DOMContentLoaded", function () {
    // 1. Load Sidebar
    fetch("../layout/sidebar.html").then(res => res.text()).then(data => {
        document.getElementById("sidebar-container").innerHTML = data;
    });

    // 2. Data mẫu (30 dòng)
    const mockData = [];
    for (let i = 1; i <= 30; i++) {
        mockData.push({
            ngay: `${i.toString().padStart(2, '0')}/03/2026`,
            mon: i % 2 === 0 ? "Lập trình Web" : "Cơ sở dữ liệu",
            lop: "D22_TH08",
            gv: "TS. Nguyễn Văn A",
            ca: `Ca ${(i % 4) + 1}`,
            gio: `0${7 + (i % 2)}:15`
        });
    }

    let filteredData = [...mockData];
    let currentPage = 1;
    const limit = 5;

    window.renderTable = function() {
        const start = (currentPage - 1) * limit;
        const currentData = filteredData.slice(start, start + limit);

        document.getElementById("attendanceTable").innerHTML = currentData.map(item => `
            <tr>
                <td class="ps-4 fw-bold text-info">${item.ngay}</td>
                <td><div class="fw-bold">${item.mon}</div><div class="small text-white-50">${item.lop}</div></td>
                <td><span class="badge bg-danger">${item.ca}</span></td>
                <td>${item.gv}</td>
                <td class="text-center fw-bold text-success">${item.gio}</td>
            </tr>
        `).join('');

        document.getElementById("showingResult").innerText = `Đang hiện ${start + 1} - ${Math.min(start + limit, filteredData.length)} trên ${filteredData.length} kết quả`;
        renderPagination();
    }

    // 3. Logic Phân Trang Theo Yêu Cầu
    function renderPagination() {
        const totalPage = Math.ceil(filteredData.length / limit);
        let pgHtml = `<ul class="pagination">`;

        // CHỈ HIỆN nút "Đầu" và "Trước" khi ở trang 2 trở đi
        if (currentPage > 1) {
            pgHtml += `<li class="page-item"><a class="page-link" href="javascript:setPage(1)">« Đầu</a></li>`;
            pgHtml += `<li class="page-item"><a class="page-link" href="javascript:setPage(${currentPage - 1})">‹</a></li>`;
        }

        // Các số trang và dấu ...
        if (totalPage <= 5) {
            for (let i = 1; i <= totalPage; i++) pgHtml += addPageItem(i);
        } else {
            pgHtml += addPageItem(1);
            if (currentPage > 3) pgHtml += `<li class="dots">...</li>`;
            
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPage - 1, currentPage + 1);
            
            if (currentPage <= 3) end = 4;
            if (currentPage >= totalPage - 2) start = totalPage - 3;

            for (let i = start; i <= end; i++) pgHtml += addPageItem(i);

            if (currentPage < totalPage - 2) pgHtml += `<li class="dots">...</li>`;
            pgHtml += addPageItem(totalPage);
        }

        // CHỈ HIỆN nút "Sau" và "Cuối" khi chưa tới trang cuối
        if (currentPage < totalPage) {
            pgHtml += `<li class="page-item"><a class="page-link" href="javascript:setPage(${currentPage + 1})">›</a></li>`;
            pgHtml += `<li class="page-item"><a class="page-link" href="javascript:setPage(${totalPage})">Cuối »</a></li>`;
        }

        pgHtml += `</ul>`;
        document.getElementById("paginationBox").innerHTML = pgHtml;
    }

    function addPageItem(i) {
        return `<li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="javascript:setPage(${i})">${i}</a></li>`;
    }

    window.setPage = (p) => { currentPage = p; renderTable(); };
    window.filterData = () => {
        const s = document.getElementById("searchInput").value.toLowerCase();
        filteredData = mockData.filter(item => item.mon.toLowerCase().includes(s));
        currentPage = 1;
        renderTable();
    };

    renderTable();
});