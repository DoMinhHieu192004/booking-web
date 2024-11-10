const inputUserName = document.querySelectorAll('input')[0]
const inputPassword = document.querySelectorAll('input')[1]

const button = document.querySelector(".container button")
const container = document.querySelector(".container")
const loader = document.querySelector("div.loader")

container.style.display = 'none'
setTimeout(() => {
    loader.style.display = "none"
    container.style.display = "flex"
}, 2000);

button.addEventListener("click", function (event) {
    event.preventDefault()
    if(inputUserName.value == "" || inputPassword.value == ""){
        alert("Please enter complete information")
    } else {
    const userRegisterLocalStorage = JSON.parse(localStorage.getItem("userRegister"))

    if(inputUserName.value == userRegisterLocalStorage.username && inputPassword.value == userRegisterLocalStorage.password){
        swal({
            icon: 'success',
            title: 'Đăng nhập thành công!',
        }).then(() => {
            setTimeout(() => {
                window.location.href = "Home.html"
            },500)})
    } else{
        swal({
            title: 'Login Fail',
            icon: 'error',
        })
        inputName.value = ""
        inputPassword.value = ""
    }
}
})