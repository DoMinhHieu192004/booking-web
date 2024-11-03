function showImages(buttonId) {

    const allOptions = document.querySelectorAll('.options');
    allOptions.forEach(option => {
        option.style.display = 'none';
    });

    if (buttonId === 'btn1') {
        document.querySelector('.option1-img').style.display = 'flex';
        document.querySelector('.image-button1').classList.toggle('active');
    } else if (buttonId === 'btn2') {
        document.querySelector('.option2-img').style.display = 'flex';
        document.querySelector('.image-button2').classList.toggle('active');
    } else if (buttonId === 'btn3') {
        document.querySelector('.option3-img').style.display = 'flex';
        document.querySelector('.image-button3').classList.toggle('active');
    } else if (buttonId === 'btn4') {
        document.querySelector('.option4-img').style.display = 'flex';
        document.querySelector('.image-button4').classList.toggle('active');
    }
}

function scrollToSection(event, sectionId) {
    event.preventDefault();
    const targetSection = document.getElementById(sectionId);
    targetSection.scrollIntoView({ behavior: 'smooth' });
}

function searchAndScroll() {
    const keyword = document.getElementById('search-input').value.toLowerCase().trim();
    const sections = document.querySelectorAll('#food, #in4, footer'); 

    for (let section of sections) {
        if (section.textContent.toLowerCase().includes(keyword)) {
            section.scrollIntoView({ behavior: 'smooth' });
            return; 
        }
    }

    alert("Không tìm thấy từ khóa trong nội dung!");
}

