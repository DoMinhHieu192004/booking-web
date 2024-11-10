const inputName = document.querySelectorAll('input')[0];
const inputBirthDay = document.querySelectorAll('input')[1];
const inputPhone = document.querySelectorAll('input')[2];

const buttonSignUp = document.querySelector(".container-0 button");
const container = document.querySelector(".container-0");
const loader = document.querySelector("div.loader");

setTimeout(() => {
    loader.style.display = "none";
    container.style.display = "flex";
}, 2000);

let userRegister = JSON.parse(localStorage.getItem("userRegister"));
if (!userRegister) {
    alert("Không có thông tin người dùng. Vui lòng đăng ký trước.");
    window.location.href = "Register.html";  
}

buttonSignUp.addEventListener("click", function (event) {
    event.preventDefault();

    userRegister = {
        ...userRegister, 
        name: inputName.value,
        birthday: inputBirthDay.value,
        phone: inputPhone.value
    };

    if (inputName.value === "" || inputBirthDay.value === "" || inputPhone.value === "") {
        alert("Vui lòng điền đủ thông tin.");
    } else {
        async function postData(urlApi = "", data = {}) {
            const config = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            };

            const response = await fetch(urlApi, config);
            return response.json();
        }

        postData(`https://67239025493fac3cf24b6e6e.mockapi.io/api/v1/register/${userRegister.id}`, userRegister)
            .then(data => {
                localStorage.setItem("userRegister", JSON.stringify(data));
                swal({
                    icon: 'success',
                    title: 'Đăng ký thành công!',
                }).then(() => {
                    setTimeout(() => {
                        window.location.href = "Login.html";
                    }, 500);
                });
            })
            .catch(error => {
                console.error("Lỗi khi cập nhật thông tin:", error);
                alert("Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại.");
            });
    }
});
