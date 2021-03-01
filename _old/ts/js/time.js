export const clock = ()=> { 
    let date = new Date();
    let moth_num = date.getMonth();
    let day = date.getDate();
    let hourse = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let moth = ["января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    
    if(day<=9) day = "0"+day
    if(hourse<=9) hourse = "0"+hourse
    if(minutes<=9) minutes = "0"+minutes
    if(seconds<=9) seconds = "0"+seconds
    
    let date_time = `${hourse}:${minutes}:${seconds}`;
    let timeForm = document.querySelector('.header__clock');
    let dateForm = document.querySelector('.header__date');
    
    let dates = `${day} ${moth[moth_num]} ${date.getFullYear()}г.`
    
    timeForm.textContent = date_time;
    dateForm.textContent = dates;
    }