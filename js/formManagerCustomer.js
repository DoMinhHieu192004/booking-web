const apiUrls = [
    'https://6725922fc39fedae05b5163c.mockapi.io/booking', // Floor 1
    'https://6726edb9302d03037e6ebcec.mockapi.io/api/v1/floor', // Floor 2
    'https://6726edb9302d03037e6ebcec.mockapi.io/api/v1/floor3' // Floor 3
];
const customerList = document.querySelector('.customer-list');

async function loadBookings() {
    try {
        const bookingPromises = apiUrls.map(url => fetch(url).then(response => response.json()));
        const allBookings = await Promise.all(bookingPromises);
        const bookings = allBookings.flat();

        customerList.innerHTML = `
            <div class="list-header row">
                <div class="cell">STT</div>
                <div class="cell">Họ và tên</div>
                <div class="cell">Ngày</div>
                <div class="cell">Giờ</div>
                <div class="cell">Bàn đã đặt</div>
                <div class="cell">Số điện thoại</div>
                <div class="cell">Note</div>
                <div class="cell">Tình trạng</div>
                <div class="cell">Yêu cầu hủy</div>
            </div>`;

        bookings.forEach((booking, index) => {
            const listItem = document.createElement('div');
            listItem.classList.add('list-item', 'row');

            const bookingDate = new Date(booking.time).toLocaleDateString('vi-VN');
            const bookingTime = new Date(booking.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

            listItem.innerHTML = `
                <div class="cell">${index + 1}</div>
                <div class="cell">${booking.name || "Không rõ"}</div>
                <div class="cell">${bookingDate}</div>
                <div class="cell">${bookingTime}</div>
                <div class="cell">${booking.nameTable || "Không rõ"}</div>
                <div class="cell">${booking.phone || "Không có"}</div>
                <div class="cell">${booking.note || "Không có"}</div>
                <div class="cell" id="white">
                    <select class="action-select" data-id="${booking.id}" data-url="${getBookingUrl(booking.id)}">
                        <option value="Chưa xác nhận" ${booking.status === "Chưa xác nhận" ? "selected" : ""}>Chưa xác nhận</option>
                        <option value="Đã xác nhận" ${booking.status === "Đã xác nhận" ? "selected" : ""}>Đã xác nhận</option>
                        <option value="Xác nhận hủy" ${booking.status === "Xác nhận hủy" ? "selected" : ""}>Xác nhận hủy</option>
                        <option value="Đã xong" ${booking.status === "Đã xong" ? "selected" : ""}>Đã xong</option>
                    </select>
                </div>
                <div class="cell">${booking.cancel || "Không yêu cầu hủy"}</div>
            `;

            const statusSelect = listItem.querySelector('.action-select');
            statusSelect.addEventListener('change', (event) => handleStatusChange(event, booking.id, statusSelect.getAttribute('data-url')));

            customerList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
}

async function handleStatusChange(event, bookingId, bookingUrl) {
    const newStatus = event.target.value;
    try {
        const response = await fetch(`${bookingUrl}/${bookingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            console.log(`Cập nhật trạng thái thành công cho đơn ${bookingId} thành ${newStatus}`);
            updateSelectStyle(event.target);
        } else {
            console.error("Lỗi khi cập nhật trạng thái");
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error);
    }
}

function getBookingUrl(bookingId) {
    if (bookingId.startsWith("1")) return apiUrls[0];
    if (bookingId.startsWith("2")) return apiUrls[1];
    return apiUrls[2];
}

function updateSelectStyle(select) {
    const selectedOption = select.value;
    if (selectedOption === "Đã xác nhận") {
        select.style.backgroundColor = "#00A66EB2";
        select.style.color = "#fff";
    } else if (selectedOption === "Xác nhận hủy") {
        select.style.backgroundColor = "#ff2e5f";
        select.style.color = "#fff";
    } else if (selectedOption === "Đã xong") {
        select.style.backgroundColor = "#00b300";
        select.style.color = "#fff";
    } else {
        select.style.backgroundColor = "#FFFFFF";
        select.style.color = "#000";
    }
}

loadBookings();
