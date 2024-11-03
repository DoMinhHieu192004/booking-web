const apiUrl = 'https://6725922fc39fedae05b5163c.mockapi.io/3';

const tableNumberInput = document.getElementById('table-number');
const tableInfoInput = document.querySelector('.input-group textarea');
const addTableBtn = document.querySelector('.add-table-btn');
const editBtn = document.querySelector('.edit-btn');
const saveBtn = document.querySelector('.save-btn');
const deleteBtn = document.querySelector('.button-group button:nth-child(2)');
const imagePreview = document.querySelector('.image-preview');
const floorLayoutContainer = document.querySelector('.floor-layout-new');
const imageInputButton = document.querySelector('.button-group button:first-child');

let isEditing = false;
let currentTable = null;
let imageUrl = '';

async function loadTables() {
    const response = await fetch(apiUrl);
    const tables = await response.json();
    tables.forEach(table => createTableButton(table));
}

function createTableButton(tableData) {
    const { id, name, xPosition, yPosition, imageUrl: imgUrl, info } = tableData;

    const tableButton = document.createElement('button');
    tableButton.classList.add('table-button');
    tableButton.innerText = name;
    tableButton.style.position = 'absolute';
    tableButton.style.left = `${xPosition}px`;
    tableButton.style.top = `${yPosition}px`;
    tableButton.dataset.id = id;

    tableButton.addEventListener('click', () => {
        if (!isEditing) {
            currentTable = { id, element: tableButton };
            tableNumberInput.value = name;
            tableInfoInput.value = info;
            imagePreview.style.backgroundImage = imgUrl ? `url(${imgUrl})` : '';
            imagePreview.style.color = imgUrl ? 'transparent' : '#888';
            imageUrl = imgUrl;
        }
    });

    tableButton.addEventListener('mousedown', (e) => {
        if (isEditing) handleDragStart(e, tableButton);
    });

    floorLayoutContainer.appendChild(tableButton);
}

addTableBtn.addEventListener('click', async () => {
    const newTable = {
        name: `Bàn ${Math.floor(Math.random() * 100)}`,
        info: '',
        xPosition: Math.random() * (floorLayoutContainer.clientWidth - 50),
        yPosition: Math.random() * (floorLayoutContainer.clientHeight - 50),
        imageUrl: ''
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTable)
    });
    const tableData = await response.json();
    createTableButton(tableData);
});

editBtn.addEventListener('click', () => {
    isEditing = !isEditing;
    editBtn.textContent = isEditing ? 'Đang Sửa...' : 'Sửa';
});

function handleDragStart(e, element) {
    let offsetX = e.clientX - element.getBoundingClientRect().left;
    let offsetY = e.clientY - element.getBoundingClientRect().top;

    const moveTable = (e) => {
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        newX = Math.max(0, Math.min(newX, floorLayoutContainer.clientWidth - element.offsetWidth));
        newY = Math.max(0, Math.min(newY, floorLayoutContainer.clientHeight - element.offsetHeight));

        element.style.left = `${newX}px`;
        element.style.top = `${newY}px`;
    };

    const stopMoveTable = () => {
        document.removeEventListener('mousemove', moveTable);
        document.removeEventListener('mouseup', stopMoveTable);

        if (currentTable) {
            updateTablePosition(currentTable.id, parseFloat(element.style.left), parseFloat(element.style.top));
        }
    };

    document.addEventListener('mousemove', moveTable);
    document.addEventListener('mouseup', stopMoveTable);
}

async function updateTablePosition(id, x, y) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xPosition: x, yPosition: y })
    });
}

imageInputButton.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                imageUrl = reader.result;
                imagePreview.style.backgroundImage = `url(${imageUrl})`;
                imagePreview.style.color = 'transparent';
            };
            reader.readAsDataURL(file);
        }
    };
    fileInput.click();
});

saveBtn.addEventListener('click', async () => {
    if (currentTable) {
        const updatedTableData = {
            name: tableNumberInput.value.trim(),
            info: tableInfoInput.value.trim(),
            imageUrl: imageUrl
        };

        try {
            const response = await fetch(`${apiUrl}/${currentTable.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTableData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedData = await response.json();
            currentTable.element.innerText = updatedData.name;
            alert('Thông tin bàn đã được lưu thành công!');
            
            if (imageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imageUrl);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật bàn:", error);
            alert('Có lỗi xảy ra khi lưu thông tin bàn. Vui lòng thử lại.');
        }
    } else {
        alert('Không có bàn nào đang được chọn để lưu.');
    }
});

deleteBtn.addEventListener('click', async () => {
    if (currentTable) {
        const confirmed = confirm('Bạn có chắc chắn muốn xóa bàn này không?');
        if (confirmed) {
            await fetch(`${apiUrl}/${currentTable.id}`, { method: 'DELETE' });
            currentTable.element.remove();
            currentTable = null;
            tableNumberInput.value = '';
            tableInfoInput.value = '';
            imagePreview.style.backgroundImage = '';
            alert('Bàn đã được xóa!');
        }
    }
});

loadTables();
