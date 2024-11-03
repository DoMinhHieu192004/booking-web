const apiUrl = 'https://6725922fc39fedae05b5163c.mockapi.io/3';
const apiUrl1 = 'https://6726edb9302d03037e6ebcec.mockapi.io/api/v1/floor';

const dateInput = document.querySelector('input[placeholder="xx/xx/xxxx"]');
const timeInput = document.querySelector('input[placeholder="xx : xx AM/PM"]');
const selectButton = document.querySelector('.select-button');
const imagePreview = document.querySelector('.table-image');
const tableName = document.querySelector('.table-name');
const tableInfoList = document.querySelector('.table-features');
const nameInput = document.querySelector('.form-input[placeholder="Họ và tên"]');
const phoneInput = document.querySelector('.form-input[placeholder="Số điện thoại"]');
const guestsInput = document.querySelector('.form-input2[placeholder="Số người"]');
const noteInput = document.querySelector('.form-input2[placeholder="Ghi chú (nếu có)"]');
const floorLayoutContainer = document.getElementById('floorLayoutContainer');

let currentTable = null;

async function loadTables() {
    try {
        const response = await fetch(apiUrl);
        const tables = await response.json();
        console.log("Tables:", tables);

        tables.forEach(table => createTableButton(table));
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
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
        currentTable = { id, element: tableButton };
        tableName.innerText = name;
        imagePreview.src = imgUrl || './path/to/default-image.jpg';
        imagePreview.alt = name;

        tableInfoList.innerHTML = '';

        if (info && info.trim() !== '') {
            const listItem = document.createElement('li');
            listItem.textContent = info;
            tableInfoList.appendChild(listItem);
        } else {
            tableInfoList.innerHTML = '<li>Không có thông tin cho bàn này</li>';
        }

        nameInput.value = '';
        phoneInput.value = '';
        guestsInput.value = '';
        noteInput.value = '';
    });

    floorLayoutContainer.appendChild(tableButton);
}

async function checkAvailability() {
    const date = dateInput.value;
    const time = timeInput.value;
    if (!date || !time) return alert("Vui lòng chọn ngày và giờ để kiểm tra tình trạng bàn!");

    const bookingTime = new Date(`${date}T${time}`);
    const startTime = new Date(bookingTime);
    startTime.setHours(startTime.getHours() - 1);
    const endTime = new Date(bookingTime);
    endTime.setHours(endTime.getHours() + 2);

    try {
        const response = await fetch(apiUrl1);
        const bookings = await response.json();

        const tableButtons = document.querySelectorAll('.table-button');
        tableButtons.forEach(button => {
            const tableId = button.dataset.id;
            const isAvailable = bookings.every(booking => {
                const bookingTime = new Date(booking.time);
                return (
                    booking.id !== tableId ||
                    bookingTime < startTime ||
                    bookingTime > endTime
                );
            });

            if (isAvailable) {
                button.style.backgroundColor = 'green';
                button.disabled = false;
            } else {
                button.style.backgroundColor = 'red';
                button.disabled = true;
            }
        });
    } catch (error) {
        console.error('Lỗi khi kiểm tra tình trạng bàn:', error);
    }
}

async function saveBooking() {
    if (!currentTable || currentTable.element.disabled) {
        alert("Bàn hiện tại không khả dụng để đặt!");
        return;
    }

    const date = dateInput.value;
    const time = timeInput.value;
    const name = nameInput.value;
    const phone = phoneInput.value;
    const numberPeople = guestsInput.value;
    const note = noteInput.value;
    const nameTable = tableName.innerText;  

    if (!date || !time || !name || !phone || !numberPeople) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    const username = localStorage.getItem('userRegister');
    
    const bookingData = {
        id: currentTable.id,
        name,
        phone,
        time: new Date(`${date}T${time}`).toISOString(),
        note,
        numberPeople,
        nameTable,  
        username,
        status: "Chưa xác nhận"
    };

    try {
        const saveResponse = await fetch(apiUrl1, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        if (saveResponse.ok) {
            alert("Đặt bàn thành công!");
            currentTable.element.style.backgroundColor = 'green';
            currentTable.element.disabled = true;

            dateInput.value = '';
            timeInput.value = '';
            nameInput.value = '';
            phoneInput.value = '';
            guestsInput.value = '';
            noteInput.value = '';
        } else {
            alert("Đã xảy ra lỗi khi đặt bàn. Vui lòng thử lại.");
        }
    } catch (error) {
        console.error('Error saving booking:', error);
        alert("Đã xảy ra lỗi khi đặt bàn. Vui lòng thử lại.");
    }
}

loadTables();

selectButton.addEventListener('click', checkAvailability);
document.querySelector('.select-button1').addEventListener('click', saveBooking);

const historyButton = document.querySelector(".history-button");

historyButton.addEventListener("click", function () {
    window.location.href = "myOder.html";
});