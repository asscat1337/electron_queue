
export const xhr =(func,url)=>{
    fetch(url,{
        method:'POST',
        headers:{
            "Content-type":"text/plain;charset=UTF-8"
        },
        cache:"no-cache"
    })
    .then(responce=>{
        return responce.text()
    })
    .then(html=>{
        func.innerHTML = html;

        let PATH__ONE=0,PATH__TWO=0,PATH__THREE=0;
        let sound;
            // export const func = () =>{
                fetch("./php/voice.php",{
                    method:'POST',
                })
                .then(response=>response.json())
                .then(data=>{
                   if(data==null) return 
                    let result =  Object.values(data);
                    
                    let arr = result.join('').split('');
                    console.log(arr);
                    let bukva= arr.slice(0,1).join('');
                    console.log(typeof bukva);
                    let arrNumber = arr.slice(1,5).join('');
                    let intNumber = parseInt(arrNumber,10);
                    
                    let number = intNumber%100;
                    console.log(number);
                    let simpleNumber = number%10;
                    console.log(simpleNumber);
                    
                    let CeilNumber = number
                    console.log(CeilNumber);
            
                    let threeNumber = intNumber - number;
                    let ObjectSound = { 
                        soundSimple:{
                            1:"./sound/1.wav",
                            2:"./sound/2.wav",
                            3:"./sound/3.wav",
                            4:"./sound/4.wav",
                            5:"./sound/5.wav",
                            6:"./sound/6.wav",
                            7:"./sound/7.wav",
                            8:"./sound/8.wav",
                            9:"./sound/9.wav",
                            10:"./sound/10.wav",
                            11:"./sound/11.wav",
                            12:"./sound/12.wav",
                            13:"./sound/13.wav",
                            14:"./sound/14.wav",
                            15:"./sound/15.wav",
                            16:"./sound/16.wav",
                            17:"./sound/17.wav",
                            18:"./sound/18.wav",
                            19:"./sound/19.wav",
                        },
                        soundTwo:{
                            20:"./sound/20.wav",
                            21:"./sound/21.wav",
                            22:"./sound/22.wav",
                            23:"./sound/23.wav",
                            24:"./sound/24.wav",
                            25:"./sound/25.wav",
                            26:"./sound/26.wav",
                            27:"./sound/27.wav",
                            28:"./sound/28.wav",
                            29:"./sound/29.wav",
                            30:"./sound/30.wav",
                            31:"./sound/31.wav",
                            32:"./sound/32.wav",
                            33:"./sound/33.wav",
                            34:"./sound/34.wav",
                            35:"./sound/35.wav",
                            36:"./sound/36.wav",
                            37:"./sound/37.wav",
                            38:"./sound/38.wav",
                            39:"./sound/39.wav",
                            40:"./sound/40.wav",
                            41:"./sound/41.wav",
                            42:"./sound/42.wav",
                            43:"./sound/43.wav",
                            44:"./sound/44.wav",
                            45:"./sound/45.wav",
                            46:"./sound/46.wav",
                            47:"./sound/47.wav",
                            48:"./sound/48.wav",
                            49:"./sound/49.wav",
                            50:"./sound/50.wav",
                            51:"./sound/51.wav",
                            52:"./sound/52.wav",
                            53:"./sound/53.wav",
                            54:"./sound/54.wav",
                            55:"./sound/55.wav",
                            56:"./sound/56.wav",
                            57:"./sound/57.wav",
                            58:"./sound/58.wav",
                            59:"./sound/59.wav",
                            60:"./sound/60.wav",
                            61:"./sound/61.wav",
                            62:"./sound/62.wav",
                            63:"./sound/63.wav",
                            64:"./sound/64.wav",
                            65:"./sound/65.wav",
                            66:"./sound/66.wav",
                            67:"./sound/67.wav",
                            68:"./sound/68.wav",
                            69:"./sound/69.wav",
                            70:"./sound/70.wav",
                            71:"./sound/71.wav",
                            72:"./sound/72.wav",
                            73:"./sound/73.wav",
                            74:"./sound/74.wav",
                            75:"./sound/75.wav",
                            76:"./sound/76.wav",
                            77:"./sound/77.wav",
                            78:"./sound/78.wav",
                            79:"./sound/79.wav",
                            80:"./sound/80.wav",
                            81:"./sound/81.wav",
                            82:"./sound/82.wav",
                            83:"./sound/83.wav",
                            84:"./sound/84.wav",
                            85:"./sound/85.wav",
                            86:"./sound/86.wav",
                            87:"./sound/87.wav",
                            88:"./sound/88.wav",
                            89:"./sound/89.wav",
                            90:"./sound/90.wav",
                            91:"./sound/91.wav",
                            92:"./sound/92.wav",
                            93:"./sound/93.wav",
                            94:"./sound/94.wav",
                            95:"./sound/95.wav",
                            96:"./sound/96.wav",
                            97:"./sound/97.wav",
                            98:"./sound/98.wav",
                            99:"./sound/99.wav",
                        }, 
                        SoundThree:{
                            100:"./sound/100.wav",
                            200:"./sound/200.wav",
                            300:"./sound/300.wav",
                            400:"./sound/400.wav",
                            500:"./sound/500.wav",
                            600:"./sound/600.wav",
                            700:"./sound/700.wav",
                            800:"./sound/800.wav",
                            900:"./sound/900.wav"
                        }
                    };
            
                    for(let [key,value] of Object.entries(ObjectSound.SoundThree)){
                        if(key>=100 || key<=900){
                            let x1 = parseInt(key,10);
                            if(x1==threeNumber){
                                PATH__ONE = value;
                            }else if(threeNumber===0){
                                PATH__ONE = undefined
                            }
                        }
                    }
                    for(let [key,value] of Object.entries(ObjectSound.soundTwo)){
                        if(key>=20 || key<=90){
                            let x2 = parseInt(key,10);
                            if(x2==CeilNumber){
                                console.log(key)
                                PATH__TWO = value
                            }else if(CeilNumber===0){
                                PATH__TWO = undefined
                            }
                        }
                    }
                    for(let [key,value] of Object.entries(ObjectSound.soundSimple)){
                        if(key>=1 || key<=20){
                            let x2 = parseInt(key,10);
                            if(x2==simpleNumber){
                                console.log(value);
                                PATH__THREE = value
                            }else if(simpleNumber===0){
                                PATH__THREE = undefined;
                            }
                        }
                    }
                    let arr_RU = 
                    {
                        'А':"./sound/_rus_a.wav", 
                        'Б':"./sound/_rus_b.wav", 
                        'В':"./sound/_rus_v.wav", 
                        'Г':"./sound_rus_g.wav", 
                        'Д':"./sound/_rus_d.wav", 
                        'Е':"./sound/_rus_e.wav", 
                        'Ё':"./sound/_rus_io.wav", 
                        'Ж':"./sound/_rus_jz.wav", 
                        'З':"./sound/_rus_z.wav", 
                        'И':"./sound/_rus_i.wav", 
                        'Й':"./sound/_rus_ii.wav", 
                        'К':"./sound/_rus_k.wav", 
                        'Л':"./sound/_rus_l.wav", 
                        'М':"./sound/_rus_m.wav", 
                        'Н':"./sound/_rus_n.wav",
                        'О':"./sound/_rus_o.wav", 
                        'П':"./sound/_rus_p.wav", 
                        'Р':"./sound/_rus_r.wav", 
                        'С':"./sound/_rus_s.wav", 
                        'Т':"./sound/_rus_t.wav", 
                        'У':"./sound/_rus_u.wav",
                         'Ф':"./sound/_rus_f.wav", 
                         'Х':"./sound/_rus_x.wav", 
                         'Ц':"./sound/_rus_c.wav", 
                         'Ч':"./sound/_rus_ch.wav", 
                         'Ш':"./sound/_rus_sh.wav", 
                         'Щ':"./sound/_rus_gh.wav",
                          'Э':"./sound/_rus_ee.wav", 
                          'Ю':"./sound/_rus_iu.wav", 
                          'Я':"./sound/_rus_ia.wav"
                       };
                  let audio = 'sound/client.wav'
                  let audioWord = ''
                  for(let [key,value] of Object.entries(arr_RU)){
                      if(key==bukva){
                          audioWord = value
                      }
                  }
                
                    if(PATH__ONE==undefined && PATH__TWO==undefined){
                        sound = [audio,audioWord,PATH__THREE];
                    }
                    else if(PATH__TWO==undefined){
                        sound = [audio,audioWord,PATH__ONE,PATH__THREE];
                    }
                    else if(PATH__THREE !==undefined || PATH__THREE == undefined ){
                        console.log(PATH__TWO);
                        sound = [audio,audioWord,PATH__ONE,PATH__TWO]
                    }
            
                    document.body.insertAdjacentHTML('afterbegin',`<audio class=player autoplay></audio>`)
                                        let player = document.querySelector('.player');
                                        console.log(player);
                                      
                                        let current = 0;
                                        
                                        let arr1=sound.filter(item=>{
                                            return item !==undefined;
                                        })
                                     
                                        
                                        player.src = arr1[0];
                                        player.addEventListener('ended',()=>{
                                            current++;
                                            if(current>=arr1.length) player.remove();
                                            player.src = arr1[current];
                                            player.play();
                                            
                                        })
            
                    })
    })
    .catch(err=>console.error(err))
}