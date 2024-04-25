let audioElement = new Audio() ;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startSound') {
        run(message.shekh , message.ChooseSurah , message.fromAya , message.ToAya , message.ayaRebeat , message.blockRebeat)
    }
    else if(message.action === 'playSound'){
        audioElement.play();
    }
    else if(message.action === 'stopSound'){
        audioElement.pause();
    }
});


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

async function run(shekh , ChooseSurah, fromAya, ToAya, ayaRebeat, blockRebeat) {
    let result = await start(shekh, ChooseSurah, fromAya, ToAya, ayaRebeat);
    console.log("finish");
    if(result == "done"){
        for(let i =1 ; i < blockRebeat ; i ++ ){
            console.log("what ? ");
            await start(shekh, ChooseSurah, fromAya, ToAya, ayaRebeat)
        }
    }else{
        return Error("error in running")
    }
}
