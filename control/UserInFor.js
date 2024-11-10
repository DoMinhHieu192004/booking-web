const nameUser = document.querySelectorAll('p')[0];
const phone = document.querySelectorAll('p')[1];
const birthday = document.querySelectorAll('p')[2];

const buttons = document.querySelectorAll(".button-group button");
const buttonFix = buttons[0];
const buttonBookingInfor = buttons[1];
const container = document.querySelector(".all");
const loader = document.querySelector("div.loader");

setTimeout(() => {
    loader.style.display = "none";
    container.style.display = "flex";
}, 2000);

const userRegisterLocalStorage = JSON.parse(localStorage.getItem("userRegister"));
nameUser.innerHTML = "Họ và tên: " + userRegisterLocalStorage?.name;
phone.innerHTML = "Số điện thoại: " + userRegisterLocalStorage?.phone;
birthday.innerHTML = "Ngày tháng năm sinh: " + userRegisterLocalStorage?.birthday;

buttonFix.addEventListener("click", function () {
    window.location.href = "FixUserInFor.html";
    console.log("Chuyển hướng đến trang sửa thông tin người dùng");
});

buttonBookingInfor.addEventListener("click", function () {
    window.location.href = "myOder.html";
    console.log("Chuyển hướng đến trang sửa thông tin người dùng");
});