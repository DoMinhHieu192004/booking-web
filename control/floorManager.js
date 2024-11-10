const buttons = document.querySelectorAll('.menu-btn');
const editFormContainer = document.querySelector('.edit-form-container');
const editFloorBtn = document.querySelector('.edit-floor-btn');
const floorSelect = document.getElementById('floor-select');
const floorInfo = document.getElementById('floor-info');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');

const apiUrls = {
    '1': 'https://672f3b7b229a881691f2425b.mockapi.io/floor1',
    '2': 'https://672f3b7b229a881691f2425b.mockapi.io/floor2',
    '3': 'https://672f6318229a881691f2cb2e.mockapi.io/floor3'
};

// Thay đổi màu nền cho các nút khi tương tác
buttons.forEach(button => {
    button.style.backgroundColor = '#ffffff';
    button.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#72CAAF';
    });
    button.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#ffffff';
    });
    button.addEventListener('mousedown', function() {
        this.style.backgroundColor = '#00A66E';
    });
});

// Điều hướng đến các trang quản lý từng tầng
buttons[0].addEventListener("click", () => window.location.href = "managerTable1.html");
buttons[1].addEventListener("click", () => window.location.href = "managerTable2.html");
buttons[2].addEventListener("click", () => window.location.href = "managerTable3.html");

// Mở form chỉnh sửa
editFloorBtn.addEventListener('click', () => {
    editFormContainer.classList.remove('hidden');
    loadFloorInfo();
});

// Ẩn form chỉnh sửa khi bấm hủy
cancelBtn.addEventListener('click', () => {
    editFormContainer.classList.add('hidden');
    floorInfo.value = "";
});

// Hàm tải thông tin tầng từ MockAPI
async function loadFloorInfo() {
    const selectedFloor = floorSelect.value;
    try {
        const response = await fetch(apiUrls[selectedFloor]);

        if (response.ok) {
            const data = await response.json();

            // Nếu không có dữ liệu hoặc dữ liệu trống, thiết lập textarea rỗng
            if (data.length === 0 || !data[0].info) {
                floorInfo.value = "";
            } else {
                floorInfo.value = data[0].info;
            }
        } else if (response.status === 404) {
            console.warn(`Không tìm thấy dữ liệu cho tầng ${selectedFloor}`);
            floorInfo.value = "";
        } else {
            console.error(`Lỗi tải dữ liệu (mã lỗi: ${response.status})`);
            alert("Không thể tải thông tin tầng");
        }
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        alert("Không thể kết nối tới máy chủ");
    }
}

// Tự động tải thông tin khi chọn tầng khác
floorSelect.addEventListener('change', loadFloorInfo);

// Hàm lưu thông tin tầng
saveBtn.addEventListener('click', async function () {
    const selectedFloor = floorSelect.value;
    const info = floorInfo.value.trim();

    if (!info) {
        alert("Vui lòng nhập thông tin!");
        return;
    }

    try {
        // Kiểm tra nếu dữ liệu tầng có tồn tại không
        const checkResponse = await fetch(apiUrls[selectedFloor]);
        const existingData = await checkResponse.json();

        if (existingData.length === 0) {
            // Nếu không có dữ liệu, tạo mới với POST
            await fetch(apiUrls[selectedFloor], {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: selectedFloor, info })
            });
        } else {
            // Nếu đã có dữ liệu, cập nhật với PUT
            await fetch(`${apiUrls[selectedFloor]}/${existingData[0].id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ info })
            });
        }

        alert('Lưu thông tin thành công!');
        editFormContainer.classList.add('hidden');
        floorInfo.value = "";
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        alert("Đã xảy ra lỗi khi lưu thông tin");
    }
});
