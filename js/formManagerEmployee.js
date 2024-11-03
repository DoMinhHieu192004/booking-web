const apiURL = "https://67239025493fac3cf24b6e6e.mockapi.io/api/v1/employee";

let isEditMode = false;
let editingEmployeeId = null;

function toggleAddEmployeeForm() {
    const form = document.getElementById("addEmployeeForm");
    form.style.display = form.style.display === "none" ? "flex" : "none";

    if (!isEditMode) {
        document.getElementById("addEmployeeForm").onsubmit = (event) => {
            event.preventDefault();
            handleAddEmployee();
        };
    }
}

function handleAddEmployee() {
    const name = document.getElementById("newName").value;
    const employeeId = document.getElementById("newEmployeeId").value;
    const salary = document.getElementById("newSalary").value;
    const job = document.getElementById("newJob").value;
    const type = document.getElementById("newType").value;

    if (isEditMode) {
        updateEmployee(editingEmployeeId);
    } else {
        addEmployee(name, employeeId, salary, job, type);
    }

    document.getElementById("newName").value = "";
    document.getElementById("newEmployeeId").value = "";
    document.getElementById("newSalary").value = "";
    document.getElementById("newJob").value = "";
    document.getElementById("newType").value = "Part-time";
    
    isEditMode = false;
    editingEmployeeId = null;
    form.style.display = "none";
}

async function addEmployee(name, employeeId, salary, job, type) {
    try {
        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                employeeId: employeeId,
                salary: salary,
                job: job,
                type: type
            })
        });

        if (response.ok) {
            alert("Thêm nhân viên thành công!");
            loadEmployees();
        } else {
            alert("Có lỗi xảy ra khi thêm nhân viên.");
        }
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Không thể kết nối tới MockAPI.");
    }
}

async function loadEmployees() {
    try {
        const response = await fetch(apiURL);
        const employees = await response.json();

        const employeeList = document.getElementById("employeeList");
        employeeList.innerHTML = "";

        employees.forEach((employee, index) => {
            const row = document.createElement("div");
            row.classList.add("list-item", "row");

            row.innerHTML = `
                <div class="cell">${index + 1}</div>
                <div class="cell">${employee.name}</div>
                <div class="cell">${employee.employeeId}</div>
                <div class="cell">${employee.salary}</div>
                <div class="cell">${employee.job}</div>
                <div class="cell">${employee.type}</div>
                <div class="cell">
                    <button class="edit-btn" onclick="editEmployee('${employee.id}')">Sửa</button>
                    <button class="delete-btn" onclick="deleteEmployee('${employee.id}')">Xóa</button>
                </div>
            `;
            employeeList.appendChild(row);
        });
    } catch (error) {
        console.error("Lỗi khi tải danh sách nhân viên:", error);
    }
}

async function deleteEmployee(id) {
    if (confirm("Bạn có chắc chắn muốn xóa nhân viên này không?")) {
        try {
            const response = await fetch(`${apiURL}/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Xóa nhân viên thành công!");
                loadEmployees();
            } else {
                alert("Có lỗi xảy ra khi xóa nhân viên.");
            }
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Không thể kết nối tới MockAPI.");
        }
    }
}

function editEmployee(id) {
    fetch(`${apiURL}/${id}`)
        .then(response => response.json())
        .then(employee => {
            toggleAddEmployeeForm();
            document.getElementById("newName").value = employee.name;
            document.getElementById("newEmployeeId").value = employee.employeeId;
            document.getElementById("newSalary").value = employee.salary;
            document.getElementById("newJob").value = employee.job;
            document.getElementById("newType").value = employee.type;

            isEditMode = true;
            editingEmployeeId = id;
        })
        .catch(error => console.error("Lỗi khi lấy thông tin nhân viên:", error));
}

async function updateEmployee(id) {
    const name = document.getElementById("newName").value;
    const employeeId = document.getElementById("newEmployeeId").value;
    const salary = document.getElementById("newSalary").value;
    const job = document.getElementById("newJob").value;
    const type = document.getElementById("newType").value;

    try {
        const response = await fetch(`${apiURL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                employeeId: employeeId,
                salary: salary,
                job: job,
                type: type
            })
        });

        if (response.ok) {
            alert("Cập nhật nhân viên thành công!");
            loadEmployees();
            toggleAddEmployeeForm();
            isEditMode = false;
        } else {
            alert("Có lỗi xảy ra khi cập nhật nhân viên.");
        }
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Không thể kết nối tới MockAPI.");
    }
}

window.onload = loadEmployees;
