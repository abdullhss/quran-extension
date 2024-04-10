// fetch API and get All arabic shekh 
let shekh = document.getElementById("shekh");
shekh.innerHTML="";
fetch('https://api.alquran.cloud/v1/edition/format/audio')
    .then(response => response.json())
    .then(data => {
        data.data.forEach(element => {
            if(element.identifier.split('.')[0]=="ar"){
                shekh.innerHTML+=`
                <option value="${element.identifier}">${element.name}</option>
                `;
            }
        });
        shekh.value = shekh[0].value ;
    })
    .catch(error => console.error('Error fetching data:', error));
// fetch API and get All surah
let ChooseSurah = document.getElementById("ChooseSurah") ;
let fromAya = document.getElementById("fromAya");
let ToAya = document.getElementById("ToAya");
let numberOfAyahs = new Array();
ChooseSurah.innerHTML = "";
fetch('https://api.alquran.cloud/v1/surah')
    .then(response => response.json())
    .then(data => {
        data.data.forEach(element => {
            ChooseSurah.innerHTML += `
            <option value="${element.number}">${element.name}</option>
            `;
            numberOfAyahs.push(element.numberOfAyahs);
        });
        ChooseSurah.value = ChooseSurah[0].value ;
        for (let i= 0; i < numberOfAyahs[ChooseSurah.value - 1] ; i++) {
            fromAya.innerHTML +=`<option value="${i+1}">${i+1}</option>`
            ToAya.innerHTML += `<option value="${i+1}">${i+1}</option>` ;
        }
    })
    .catch(error => console.error('Error fetching data:', error));
    
    ChooseSurah.addEventListener("click" , ()=>{
        console.log(numberOfAyahs[ChooseSurah.value - 1]);
        fromAya.innerHTML="";
        ToAya.innerHTML="";
        for (let i= 0; i < numberOfAyahs[ChooseSurah.value - 1] ; i++) {
            fromAya.innerHTML +=`<option value="${i+1}">${i+1}</option>`
            ToAya.innerHTML += `<option value="${i+1}">${i+1}</option>` ;
        }
    })

// Aya rebeat
let ayaRebeat = document.getElementById("ayaRebeat");
// block rebeat 
let blockRebeat = document.getElementById("blockRebeat");

let startBtn = document.getElementById("StartBtn");
let stopBtn = document.getElementById("StopBtn");
let playBtn = document.getElementById("playBtn")

let audioElement 
startBtn.addEventListener("click" , () =>{
    console.log(shekh.value );
    console.log(ChooseSurah.value);
    console.log(fromAya.value);
    console.log(ayaRebeat.value);
    console.log(blockRebeat.value);
    // start( shekh.value ,ChooseSurah.value ,fromAya.value , ToAya.value , ayaRebeat.value)
    async function run() {
        let result = await start(shekh.value, ChooseSurah.value, fromAya.value, ToAya.value, ayaRebeat.value);
        if(result == "done"){
            for(let i =1 ; i < blockRebeat.value ; i ++ ){
                await start(shekh.value, ChooseSurah.value, fromAya.value, ToAya.value, ayaRebeat.value)
            }
        }else{
            return Error("error in running")
        }
    }
    run()
})

stopBtn.addEventListener("click" , () =>{ audioElement.pause() })

playBtn.addEventListener("click" , () =>{audioElement.play()})

audioElement = new Audio();

function start( shekh , surah , fromAya , ToAya , rebeatAya ) {
        return new Promise((res , rej) => {
            if(audioElement.paused){        
                fetch(`https://api.alquran.cloud/v1/surah/${surah}/${shekh}`)
                .then(response => response.json())
                .then(data => {
                    let ayahs = data.data.ayahs ;
                    let arrOfAyahs = [] ;
                    arrOfAyahs = ayahs.slice(fromAya -1 , ToAya)
                    let temp =parseInt(arrOfAyahs.length) ; 
                    let N = temp * rebeatAya;
                    console.log(N);
        
                    arrOfAyahs = arrOfAyahs.map( (ele , i , arr) =>{
                        ele = Array(N/(N/rebeatAya)).fill("rebeat aya");
                        ele[0] = arr[i] ;
                        return ele
                    })
                    
                    
                    // arr is array of ayahs object
                    audioElement = new Audio(arrOfAyahs[0][0].audio);
                    audioElement.play()
                    
                    let rebeatAyaCounter=1;
                    let ayacounter = 0;
                    
                    audioElement.addEventListener("ended" ,() => {
                        if(ayacounter == temp-1 && rebeatAyaCounter == rebeatAya ){
                            audioElement.pause();
                            console.log("finshed 1 block");
                            res ("done")
                        }
                        else{
                            if(arrOfAyahs[ayacounter][rebeatAyaCounter] == "rebeat aya"){
                                audioElement.play();
                                rebeatAyaCounter++ ;
                            }
                            else{
                                rebeatAyaCounter = 0;
                                ayacounter ++ ; 
                                audioElement.src = arrOfAyahs[ayacounter][rebeatAyaCounter].audio ;
                                audioElement.play();
                                rebeatAyaCounter++ ;
                            }
                        }
                        console.log(temp);
                        console.log(ayacounter);
                        console.log(rebeatAyaCounter);
                    })
        
                    })
                .catch(error => rej('Error fetching data:', error));
            }
        
        })
    }
