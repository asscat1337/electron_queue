const socket = io('localhost:3003',{
    credentials:true,
    transport:['pooling']
});
const tvInfo = document.querySelector('.eq__content');
const tvContent = document.querySelector('.tv__content');
let player;

if('serviceWorker' in navigator){
    navigator.serviceWorker.register('../sw.js')
        .then(()=>navigator.serviceWorker.ready.then((worker)=>{
            worker.sync.register('syncdata')
        }))
        .catch((err)=>console.log(err))
}

const getQueryStringParams = query => {
    return query
        ? (/^[?#]/.test(query) ? query.slice(1) : query)
            .split('&')
            .reduce((params, param) => {
                    let [key, value] = param.split('=');
                    params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
                    return params;
                }, {}
            )
        : {}
};
socket.on('connect',()=>{
    socket.emit('room',Object.values(getQueryStringParams(`${window.location.search}`)).join(''))
});

let arr_RU =
    {
        'А':"public/sound/_rus_a.wav",
        'Б':"public/sound/_rus_b.wav",
        'В':"public/sound/_rus_v.wav",
        'Г':"public/sound_rus_g.wav",
        'Д':"public/sound/_rus_d.wav",
        'Е':"public/sound/_rus_e.wav",
        'Ё':"public/sound/_rus_io.wav",
        'Ж':"public/sound/_rus_jz.wav",
        'З':"public/sound/_rus_z.wav",
        'И':"public/sound/_rus_i.wav",
        'Й':"public/sound/_rus_ii.wav",
        'К':"public/sound/_rus_k.wav",
        'Л':"public/sound/_rus_l.wav",
        'М':"public/sound/_rus_m.wav",
        'Н':"public/sound/_rus_n.wav",
        'О':"public/sound/_rus_o.wav",
        'П':"public/sound/_rus_p.wav",
        'Р':"public/sound/_rus_r.wav",
        'С':"public/sound/_rus_s.wav",
        'Т':"public/sound/_rus_t.wav",
        'У':"public/sound/_rus_u.wav",
        'Ф':"public/sound/_rus_f.wav",
        'Х':"public/sound/_rus_x.wav",
        'Ц':"public/sound/_rus_c.wav",
        'Ч':"public/sound/_rus_ch.wav",
        'Ш':"public/sound/_rus_sh.wav",
        'Щ':"public/sound/_rus_gh.wav",
        'Э':"public/sound/_rus_ee.wav",
        'Ю':"public/sound/_rus_iu.wav",
        'Я':"public/sound/_rus_ia.wav"
    };
let ObjectSound = {
    1:"public/sound/1.wav",
    2:"public/sound/2.wav",
    3:"public/sound/3.wav",
    4:"public/sound/4.wav",
    5:"public/sound/5.wav",
    6:"public/sound/6.wav",
    7:"public/sound/7.wav",
    8:"public/sound/8.wav",
    9:"public/sound/9.wav",
    10:"public/sound/10.wav",
    11:"public/sound/11.wav",
    12:"public/sound/12.wav",
    13:"public/sound/13.wav",
    14:"public/sound/14.wav",
    15:"public/sound/15.wav",
    16:"public/sound/16.wav",
    17:"public/sound/17.wav",
    18:"public/sound/18.wav",
    19:"public/sound/19.wav",
    20:"public/sound/20.wav",
    21:"public/sound/21.wav",
    22:"public/sound/22.wav",
    23:"public/sound/23.wav",
    24:"public/sound/24.wav",
    25:"public/sound/25.wav",
    26:"public/sound/26.wav",
    27:"public/sound/27.wav",
    28:"public/sound/28.wav",
    29:"public/sound/29.wav",
    30:"public/sound/30.wav",
    31:"public/sound/31.wav",
    32:"public/sound/32.wav",
    33:"public/sound/33.wav",
    34:"public/sound/34.wav",
    35:"public/sound/35.wav",
    36:"public/sound/36.wav",
    37:"public/sound/37.wav",
    38:"public/sound/38.wav",
    39:"public/sound/39.wav",
    40:"public/sound/40.wav",
    41:"public/sound/41.wav",
    42:"public/sound/42.wav",
    43:"public/sound/43.wav",
    44:"public/sound/44.wav",
    45:"public/sound/45.wav",
    46:"public/sound/46.wav",
    47:"public/sound/47.wav",
    48:"public/sound/48.wav",
    49:"public/sound/49.wav",
    50:"public/sound/50.wav",
    51:"public/sound/51.wav",
    52:"public/sound/52.wav",
    53:"public/sound/53.wav",
    54:"public/sound/54.wav",
    55:"public/sound/55.wav",
    56:"public/sound/56.wav",
    57:"public/sound/57.wav",
    58:"public/sound/58.wav",
    59:"public/sound/59.wav",
    60:"public/sound/60.wav",
    61:"public/sound/61.wav",
    62:"public/sound/62.wav",
    63:"public/sound/63.wav",
    64:"public/sound/64.wav",
    65:"public/sound/65.wav",
    66:"public/sound/66.wav",
    67:"public/sound/67.wav",
    68:"public/sound/68.wav",
    69:"public/sound/69.wav",
    70:"public/sound/70.wav",
    71:"public/sound/71.wav",
    72:"public/sound/72.wav",
    73:"public/sound/73.wav",
    74:"public/sound/74.wav",
    75:"public/sound/75.wav",
    76:"public/sound/76.wav",
    77:"public/sound/77.wav",
    78:"public/sound/78.wav",
    79:"public/sound/79.wav",
    80:"public/sound/80.wav",
    81:"public/sound/81.wav",
    82:"public/sound/82.wav",
    83:"public/sound/83.wav",
    84:"public/sound/84.wav",
    85:"public/sound/85.wav",
    86:"public/sound/86.wav",
    87:"public/sound/87.wav",
    88:"public/sound/88.wav",
    89:"public/sound/89.wav",
    90:"public/sound/90.wav",
    91:"public/sound/91.wav",
    92:"public/sound/92.wav",
    93:"public/sound/93.wav",
    94:"public/sound/94.wav",
    95:"public/sound/95.wav",
    96:"public/sound/96.wav",
    97:"public/sound/97.wav",
    98:"public/sound/98.wav",
    99:"public/sound/99.wav",
    100:"public/sound/100.wav",
    200:"public/sound/200.wav",
    300:"public/sound/300.wav",
    400:"public/sound/400.wav",
    500:"public/sound/500.wav",
    600:"public/sound/600.wav",
    700:"public/sound/700.wav",
    800:"public/sound/800.wav",
    900:"public/sound/900.wav"
};
let  [audioStart='public/sound/client.wav',audioCab = 'public/sound/tocabinet.wav',...rest] = [];
let   sound = [];

document.addEventListener('DOMContentLoaded',()=>{
    socket.on('message',data=>{
        console.log(data)
        if(data===undefined) return;
     data.map(item=>{
         item.terminalName.includes('reg') ? audioCab = 'public/sound/towindow.wav':audioCab = 'public/sound/tocabinet.wav'
           const service = item.number.split('');
           const letterService = service.slice(0,1).join('');
           const numberService = +service.slice(1,5).join('');
           const arrCab = +item.cabinet;
         ///// нужно переделать
             const someFunc =(object,arg)=>{
                 let arr = [];
                 Object.entries(object).find(([key,value])=>{
                     if(typeof(arg)==="number"){
                         let modul = arg%100 || arg;
                         let raz = arg-modul;
                         if(modul === +key || raz === +key){
                             arr.push(value)
                         }
                     }
                     else if(key===arg){
                         arr.push(value)
                     }
                 });
                 return arr
             }
             let number = someFunc(ObjectSound,numberService).reverse();
             let cab =  someFunc(ObjectSound,arrCab).reverse();
             let letter= someFunc(arr_RU,letterService).join(',')
         sound = [audioStart,letter,number,audioCab,cab].reduce((acc,val)=>acc.concat(val),[]);
         //sound.length = 0;
             /////
         socket.emit('update info',item.tvinfo_id);

        document.querySelector('.tv__content').insertAdjacentHTML('afterbegin',`<div class="content__box">
<span>${item.number}</span>
<svg class="arrow-bottom-4" viewBox="0 0 100 85">
  <polygon points="58.263,0.056 100,41.85 58.263,83.641 30.662,83.641 62.438,51.866 0,51.866 0,31.611 62.213,31.611 30.605,0 58.263,0.056" />
</svg>
<span>${item.cabinet}</span>
</div>`)
         document.body.insertAdjacentHTML('afterbegin',`<audio class=player autoplay></audio>`)
         let player = document.querySelector('.player');
         let current = 0;

         sound.filter(item=> item!==undefined && item!==0);
         const videoTv = document.querySelector('.video__tv');
         player.src = sound[0];
         player.addEventListener('ended',()=>{
             current++;
             if(current===sound.length){
                 player.remove();
             }else if(current!==sound.length){
                 player.src = sound[current];
                 player.play();
             }

         });
        const video = document.querySelector('.video__tv');
        if(item.number && tvContent.contains(video)){
            videoTv.pause()
        }
            tvInfo.insertAdjacentHTML('afterbegin',`<div class="result added"'>
                    <span>${item.number}</span> <svg class="arrow-right-4" viewBox="0 0 100 100">
              <polygon points="58.263,0.056 100,41.85 58.263,83.641 30.662,83.641 62.438,51.866 0,51.866 0,31.611 62.213,31.611 30.605,0 58.263,0.056" />
            </svg>
                     <span>${item.cabinet}</span>
            </div>`)
        })
        setTimeout(()=>{
            document.querySelectorAll('.result').forEach(item=>item.classList.remove('added'));
            document.querySelectorAll('.content__box').forEach(item=>item.remove())
        },15000)
        let test = document.querySelectorAll('.result');
        for(let i=0;i<test.length;i++){
            if(i===6){
                tvInfo.lastElementChild.remove();
            }
        }
        })
    });
    socket.on('repeat ticket',data=> {
        console.log(data)
        if(data===undefined) return;
        data.map(item => {
            //// дуплируется код,нужно вынести глобально
            const service = item.number.split('');
            const letterService = service.slice(0, 1).join('');
            const numberService = +service.slice(1, 5).join('');
            const arrCab = +[item.cabinet].join('').split('');
            ////
            const someFunc = (object, arg) => {
                return Object.entries(object).find(([key, value]) => {
                    if (typeof (arg) === "number") {
                        let modul = arg % 100 || arg;
                        let raz = arg - modul;
                        if (modul === +key || raz === +key) {
                            rest.push(value)
                        }
                    } else if (key === arg) {
                        rest.push(value)
                    }
                });
            }
            someFunc(ObjectSound, arrCab);
            someFunc(ObjectSound, numberService)
            someFunc(arr_RU, letterService)
            ///// нужно переделать
            let test = [audioStart].concat([audioCab, ...rest].reverse());
            const deleteCount = test.splice(-2, 2).reverse()
            sound = test.concat(deleteCount);
            test.length = 0;
            rest.length = 0;
            /////
            const promises = ()=>{
                return new Promise((resolve, reject) => {
                    resolve(sound)
                })
            };
            console.log(promises());
            document.body.insertAdjacentHTML('afterbegin', `<audio class=player autoplay></audio>`)
            player = document.querySelector('.player');

            let current = 0;
            sound.filter(item => item !== undefined)
            player.src = sound[0];
            player.addEventListener('ended', () => {
                current++;
                if (current >= sound.length) {
                    player.remove();
                }
                player.src = sound[current];
                player.play();

            });
        });
    });