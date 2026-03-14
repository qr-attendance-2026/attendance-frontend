let users=[
{id:1,name:"Nguyễn Văn A"},
{id:2,name:"Trần Thị B"},
{id:3,name:"Lê Văn C"},
{id:4,name:"Phạm Thị D"},
{id:5,name:"Hoàng Văn E"},
{id:6,name:"Đặng Thị F"},
{id:7,name:"Vũ Văn G"},
{id:8,name:"Bùi Thị H"}
]

let currentPage=1
let perPage=5

function renderTable(){

let table=document.getElementById("userTable")
table.innerHTML=""

let start=(currentPage-1)*perPage
let end=start+perPage

let pageUsers=users.slice(start,end)

pageUsers.forEach(u=>{

table.innerHTML+=`

<tr>

<td>#${u.id}</td>

<td>

<div class="d-flex align-items-center gap-2">

<div class="avatar">${u.name.charAt(0)}</div>
${u.name}

</div>

</td>

<td>

<button class="btn btn-sm btn-outline-primary" onclick="editUser(${u.id})">Edit</button>

<button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${u.id})">Delete</button>

</td>

</tr>

`

})

renderPagination()

}

function renderPagination(){

let total=Math.ceil(users.length/perPage)

let html=""

for(let i=1;i<=total;i++){

html+=`

<li class="page-item ${i==currentPage?'active':''}">
<a class="page-link" onclick="goPage(${i})">${i}</a>
</li>

`

}

document.getElementById("pagination").innerHTML=html

}

function goPage(p){
currentPage=p
renderTable()
}

function nextPage(){
let total=Math.ceil(users.length/perPage)
if(currentPage<total){currentPage++}
renderTable()
}

function prevPage(){
if(currentPage>1){currentPage--}
renderTable()
}

function firstPage(){
currentPage=1
renderTable()
}

function lastPage(){
currentPage=Math.ceil(users.length/perPage)
renderTable()
}

function addUser(){

let name=prompt("Enter name")

if(name){

users.push({id:users.length+1,name})
renderTable()

}

}

function editUser(id){

let user=users.find(u=>u.id==id)

let name=prompt("Edit name",user.name)

if(name){

user.name=name
renderTable()

}

}

function deleteUser(id){

users=users.filter(u=>u.id!=id)
renderTable()

}

function searchUser(){

let keyword=document.getElementById("search").value.toLowerCase()

let rows=document.querySelectorAll("#userTable tr")

rows.forEach(r=>{

if(r.innerText.toLowerCase().includes(keyword))
r.style.display=""
else
r.style.display="none"

})

}

renderTable()