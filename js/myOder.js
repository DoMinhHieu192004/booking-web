const apiUrl1 = 'https://6725922fc39fedae05b5163c.mockapi.io/booking';
const apiUrl2 = 'https://6726edb9302d03037e6ebcec.mockapi.io/api/v1/floor';
const apiUrl3 = 'https://6726edb9302d03037e6ebcec.mockapi.io/api/v1/floor3';
const customerList = document.querySelector('.customer-list');

async function loadBookings() {
    const username = localStorage.getItem('userRegister');

    try {
        const [response1, response2, response3] = await Promise.all([
            fetch(apiUrl1),
            fetch(apiUrl2),
            fetch(apiUrl3)
        ]);

        const bookings1 = await response1.json();
        const bookings2 = await response2.json();
        const bookings3 = await response3.json();
        const allBookings = [...bookings1, ...bookings2, ...bookings3];

        const filteredBookings = allBookings.filter(booking => booking.username === username);

        if (filteredBookings.length === 0) {
            customerList.innerHTML = '<div>Không có thông tin đặt bàn nào cho tài khoản này.</div>';
            return;
        }

        customerList.innerHTML = `
            <div class="list-header row">
                <div class="cell">STT</div>
                <div class="cell">Ngày</div>
                <div class="cell">Thời gian</div>
                <div class="cell">Tên Bàn</div>
                <div class="cell">Số người</div>
                <div class="cell">Yêu cầu hủy</div>
                <div class="cell">Tình trạng</div>
            </div>`;

        filteredBookings.forEach((booking, index) => {
            const listItem = document.createElement('div');
            listItem.classList.add('list-item', 'row');

            const bookingDate = new Date(booking.time).toLocaleDateString('vi-VN');
            const bookingTime = new Date(booking.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

            listItem.innerHTML = `
                <div class="cell">${index + 1}</div>
                <div class="cell">${bookingDate}</div>
                <div class="cell">${bookingTime}</div>
                <div class="cell">${booking.nameTable || "Không rõ"}</div>
                <div class="cell">${booking.numberPeople || "N/A"}</div>
                <div class="cell" id="white">
                    <button type="button" class="cancel-request-btn" ${booking.cancel === "Xác nhận hủy" ? "disabled" : ""}>
                        ${booking.cancel === "Xác nhận hủy" ? "Hoàn tất" : booking.cancel === "yêu cầu hủy" ? "Đang yêu cầu hủy..." : "Yêu cầu hủy"}
                    </button>
                </div>
                <div class="cell">${booking.status || "Chưa xác nhận"}</div>
            `;

            const cancelButton = listItem.querySelector('.cancel-request-btn');
            cancelButton.addEventListener('click', () => handleCancelRequest(booking.id, cancelButton, booking.floorApi));

            customerList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
}

async function handleCancelRequest(bookingId, button, floorApi) {
    const apiUrl = floorApi === 'floor2' ? apiUrl2 : floorApi === 'floor3' ? apiUrl3 : apiUrl1;

    alert("Đang yêu cầu hủy...");

    try {
        const response = await fetch(`${apiUrl}/${bookingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cancel: "Xác nhận hủy" })
        });

        if (response.ok) {
            button.textContent = "Hoàn tất";
            button.disabled = true;
        } else {
            alert("Lỗi khi yêu cầu hủy. Vui lòng thử lại.");
        }
    } catch (error) {
        console.error('Lỗi khi yêu cầu hủy:', error);
        alert("Lỗi khi yêu cầu hủy. Vui lòng thử lại.");
    }
}

loadBookings();
