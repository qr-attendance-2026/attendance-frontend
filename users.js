// 1. Cấu hình địa chỉ API
const BASE_API = 'https://api-attendance-backend-520975280881.asia-southeast1.run.app/users';
let users = [];       // Biến lưu trữ danh sách user từ server
let currentPage = 1;  // Trang hiện tại
let perPage = 5;      // Số bản ghi mỗi trang

// --- CHỨC NĂNG CHÍNH (CALL API) ---

// 1. READ: Lấy danh sách users
async function fetchUsers() {
    try {
        const response = await fetch(BASE_API);
        if (!response.ok) throw new Error("Lỗi kết nối Backend");
        users = await response.json();
        renderTable(); // Sau khi lấy dữ liệu xong thì vẽ bảng
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

// 2. CREATE: Thêm user mới
async function addUser() {
    let name = prompt("Nhập tên người dùng mới:");
    if (!name) return;

    try {
        const response = await fetch(BASE_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name })
        });

        if (response.ok) {
            await fetchUsers(); // Load lại dữ liệu mới
        }
    } catch (error) {
        console.error("Add Error:", error);
    }
}

// 3. UPDATE: Sửa tên user
async function editUser(id) {
    let user = users.find(u => u.id == id);
    let newName = prompt("Chỉnh sửa tên:", user.name);
    if (!newName || newName === user.name) return;

    try {
        const response = await fetch(`${BASE_API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        });

        if (response.ok) {
            await fetchUsers();
        }
    } catch (error) {
        console.error("Update Error:", error);
    }
}

// 4. DELETE: Xóa user
async function deleteUser(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa?")) return;

    try {
        const response = await fetch(`${BASE_API}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Nếu xóa ở trang cuối và bản ghi cuối, lùi trang
            if (users.length % perPage === 1 && currentPage > 1) currentPage--;
            await fetchUsers();
        }
    } catch (error) {
        console.error("Delete Error:", error);
    }
}

// --- CHỨC NĂNG HIỂN THỊ (RENDER UI) ---

function renderTable() {
    const tbody = document.getElementById("userTable");
    tbody.innerHTML = "";

    let start = (currentPage - 1) * perPage;
    let end = start + perPage;
    let pageUsers = users.slice(start, end);

    pageUsers.forEach(u => {
        tbody.innerHTML += `
            <tr>
                <td>#${u.id}</td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                             style="width: 30px; height: 30px; font-size: 12px;">
                            ${u.name ? u.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        ${u.name}
                    </div>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editUser(${u.id})">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${u.id})">Delete</button>
                </td>
            </tr>`;
    });
    renderPagination();
}

function renderPagination() {
    let totalPages = Math.ceil(users.length / perPage);
    let pg = document.getElementById("pagination");
    let html = "";

    for (let i = 1; i <= totalPages; i++) {
        html += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="javascript:void(0)" onclick="goPage(${i})">${i}</a>
            </li>`;
    }
    pg.innerHTML = html;
}

// --- ĐIỀU HƯỚNG PHÂN TRANG & TÌM KIẾM ---

function goPage(p) { currentPage = p; renderTable(); }
function firstPage() { currentPage = 1; renderTable(); }
function lastPage() { currentPage = Math.ceil(users.length / perPage); renderTable(); }
function prevPage() { if (currentPage > 1) { currentPage--; renderTable(); } }
function nextPage() { if (currentPage < Math.ceil(users.length / perPage)) { currentPage++; renderTable(); } }

function searchUser() {
    let keyword = document.getElementById("search").value.toLowerCase();
    // Lọc dữ liệu tại chỗ trên mảng users đã fetch
    let filtered = users.filter(u => u.name.toLowerCase().includes(keyword));
    
    // Vẽ lại bảng với mảng đã lọc (tạm thời không phân trang khi search)
    const tbody = document.getElementById("userTable");
    tbody.innerHTML = filtered.map(u => `
        <tr>
            <td>#${u.id}</td>
            <td>${u.name}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editUser(${u.id})">Edit</button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${u.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Tự động chạy khi load file
fetchUsers();