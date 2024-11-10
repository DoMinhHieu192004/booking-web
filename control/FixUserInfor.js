const inputName = document.querySelectorAll('input')[0];
const inputPhone = document.querySelectorAll('input')[1];
const inputBirthDay = document.querySelectorAll('input')[2];
const buttonSubmit = document.querySelector(".btn");
const container = document.querySelector(".all");
const loader = document.querySelector("div.loader");

setTimeout(() => {
    loader.style.display = "none";
    container.style.display = "flex";
}, 2000);

const userRegister = JSON.parse(localStorage.getItem("userRegister"));

if (userRegister) {
    inputName.value = userRegister.name || '';
    inputPhone.value = userRegister.phone || '';
    inputBirthDay.value = userRegister.birthday || '';
}

buttonSubmit.addEventListener("click", function (event) {
    event.preventDefault();

    const updatedUserData = {
        name: inputName.value,
        phone: inputPhone.value,
        birthday: inputBirthDay.value
    };

    if (inputName.value === "" || inputPhone.value === "" || inputBirthDay.value === "") {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
    }

    const userId = userRegister.id;
    const config = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUserData)
    };

    fetch(`https://67239025493fac3cf24b6e6e.mockapi.io/api/v1/register/${userId}`, config)
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("userRegister", JSON.stringify(data));

            swal({
                icon: 'success',
                title: 'Cập nhật thông tin thành công!',
            }).then(() => {
                setTimeout(() => {
                    window.location.href = "UserInFor.html";
                }, 500);
            });
        })
        .catch(error => {
            console.error("Có lỗi xảy ra khi cập nhật thông tin:", error);
            alert("Cập nhật thông tin thất bại. Vui lòng thử lại sau.");
        });
});
