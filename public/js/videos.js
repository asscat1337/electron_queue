const file__input = document.querySelector('.filename');
const preview =  document.querySelector('.preview');
const confirm = document.querySelector('.confirm');
let files = [];
function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (!bytes) {
     return '0 Byte';
    }
    const  i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
file__input.addEventListener('change',(event)=>{
     files = Array.from(event.target.files);
    files.forEach(file=>{
        if(!file.type.match('video/mp4')){
            return
        }
        const reader = new FileReader();
        reader.addEventListener('load',(ev)=> {
           preview.insertAdjacentHTML('afterbegin', `
                <div class="preview-videos">
                <div class="preview-remove" data-name="${file.name}">&times;</div>
                    <video data-name="${file.name}">
                        <source src="${ev.target.result}" alt="${file.name}">
                    </video>
                    <div class="preview-info">
                    <span>${file.name}</span>
                      ${bytesToSize(file.size)}                    
                    </div>
                </div>`
                )
        });
        reader.readAsDataURL(file)
    })
    if(files.length){
        confirm.classList.remove('hide')
    }

})
confirm.addEventListener('click',(event)=> {
    event.preventDefault();
    const formData = new FormData();
    for (let file of files) {
        formData.append('files', file)
        console.log(file)
    }
    const init = async()=>{
      await  fetch('/uploads', {
            method: 'POST',
            body: formData
        })
          .then(response=>response.json())
        .then(data=>{
            document.querySelectorAll('.preview-info').forEach(item=>{
                console.log(data.size);
                const percentage = (data.size *100)/data.size;
                item.style.bottom = '4px';
                item.innerHTML = '<div class="preview-info-progress"></div>'
                document.querySelector('.preview-info-progress').style.width = `${percentage}%`
            })
        })
            .catch(err=>console.log(err))
    };
    init();
})
preview.addEventListener('click',(event)=>{
    if(!event.target.dataset.name){
        return
    }
    const {name} = event.target.dataset;
    files = files.filter(file=>file.name !==name);
    if(!files.length){
        confirm.style.display = 'none';
    }
    const block = document.querySelector(`[data-name="${name}"]`)
        .closest('.preview-videos')
    block.classList.add('removing');

    setTimeout(()=>{
        block.remove()
    },300)
})