const inputUserName = document.querySelectorAll('input')[0]
const inputPassword = document.querySelectorAll('input')[1]
const inputPassword2 = document.querySelectorAll('input')[2]

const buttonNext = document.querySelector(".container button")
const container = document.querySelector(".container")
const loader = document.querySelector("div.loader")

setTimeout(() => {
    loader.style.display = "none"
    container.style.display = "flex"
}, 2000);

buttonNext.addEventListener("click", function (event) {
    event.preventDefault()
    if(inputPassword.value==!inputPassword2.value) {
        alert("Passwords do not match")
        return;
    } else {
    const userRegister = {
        username: inputUserName.value,
        password: inputPassword.value
    }

    if(inputUserName.value == "" ||  inputPassword.value == ""){
        alert("Vui lòng xác nhận lại mật khẩu")
    } else {
        async function postData(urlApi = "", data = {}){
            const config = {
                method : "POST",
                headers :{"Content-Type": "application/json"},
                body: JSON.stringify(data)
            }

            const respon = await fetch(urlApi, config)
            return respon.json()

        }

        const res = postData("https://67239025493fac3cf24b6e6e.mockapi.io/api/v1/register", userRegister)
        
        res.then(data => {
            localStorage.setItem("userRegister", JSON.stringify(data))
        })

        swal({
            icon: 'success',
            title: 'Thành công!',
        }).then(() => {
            setTimeout(() => {
                window.location.href = "InputInFormation.html"
            }, 500)
        })
    }}
})