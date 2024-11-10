const inputUserName = document.querySelectorAll('input')[0];
const inputPassword = document.querySelectorAll('input')[1];

const button = document.querySelector(".container button");
const container = document.querySelector(".container");
const loader = document.querySelector("div.loader");

container.style.display = 'none';
setTimeout(() => {
    loader.style.display = "none";
    container.style.display = "flex";
}, 2000);

button.addEventListener("click", function (event) {
    event.preventDefault();
    const usernameValue = inputUserName.value.trim();
    const passwordValue = inputPassword.value.trim();
    
    if (usernameValue === "" || passwordValue === "") {
        alert("Vui lòng nhập đầy đủ thông tin");
    } else {
        if (usernameValue === "minhhieu2004" && passwordValue === "minhhieu2004") {
            swal({
                icon: 'success',
                title: 'Đăng nhập thành công',
            }).then(() => {
                setTimeout(() => {
                    window.location.href = "managerSelect.html";
                }, 500);
            });
        } else {
            swal({
                title: 'Đăng nhập thất bại',
                icon: 'error',
            });
            inputUserName.value = "";
            inputPassword.value = "";
        }
    }
});
