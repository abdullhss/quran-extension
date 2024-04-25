// fetch API and get All arabic shekh 
let shekh = document.getElementById("shekh");
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
        fromAya.innerHTML="";
        ToAya.innerHTML="";
        for (let i= 0; i < numberOfAyahs[ChooseSurah.value - 1] ; i++) {
            fromAya.innerHTML +=`<option value="${i+1}">${i+1}</option>`
            ToAya.innerHTML += `<option value="${i+1}">${i+1}</option>` ;
        }
    })

// Aya rebeat
let ayaRebeat = document.getElementById("ayaRebeat");
ayaRebeat.addEventListener("blur" , ()=>{
    if(ayaRebeat.value < 1 ){
        ayaRebeat.value = 1 ;
    }
})
let incForAya = document.getElementById("incForAya");

incForAya.addEventListener("click" , () =>{
    ayaRebeat.value++ ;
})
// block rebeat 
let blockRebeat = document.getElementById("blockRebeat");
let incForBlock = document.getElementById("incForBlock"); 

blockRebeat.addEventListener("blur" , ()=>{
    if(blockRebeat.value < 1 ){
        blockRebeat.value = 1 ;
    }
})

incForBlock.addEventListener("click" , () =>{
    blockRebeat.value++ ;
})

let rebeat = document.getElementsByClassName("rebeat"); 
rebeat[0].addEventListener('click' , () =>{
    ayaRebeat.value = 1;
})
rebeat[1].addEventListener('click' , () =>{
    blockRebeat.value = 1;
})
let startBtn = document.getElementById("StartBtn");
let stopBtn = document.getElementById("StopBtn");
let playBtn = document.getElementById("playBtn")

startBtn.addEventListener("click" , () =>{
    console.log(shekh.value );
    console.log(ChooseSurah.value);
    console.log(fromAya.value);
    console.log(ayaRebeat.value);
    console.log(blockRebeat.value);
    // start( shekh.value ,ChooseSurah.value ,fromAya.value , ToAya.value , ayaRebeat.value)
    

    chrome.runtime.sendMessage({ action: 'startSound', shekh : shekh.value , ChooseSurah : ChooseSurah.value , fromAya:fromAya.value,ToAya:ToAya.value ,ayaRebeat:ayaRebeat.value , blockRebeat:blockRebeat.value });
})

stopBtn.addEventListener("click" , () => chrome.runtime.sendMessage({ action: 'stopSound' }) )

playBtn.addEventListener("click" , () => chrome.runtime.sendMessage({ action: 'playSound'}) )
document.getElementById('currentYear').textContent = new Date().getFullYear();
document.getElementById('currentYear1').textContent = new Date().getFullYear();
