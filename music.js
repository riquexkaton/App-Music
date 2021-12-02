const songsList= [
    {name:"Save Me", artist:"BTS", fileMp3:"https://res.cloudinary.com/dmtd0lklr/video/upload/v1638480915/save_Me_swtybq.mp3", img:"https://res.cloudinary.com/dmtd0lklr/image/upload/v1638482659/saveme_vrxfvq.jpg"},
    {name:"Dark house", artist:"Katty Perry", fileMp3:"https://res.cloudinary.com/dmtd0lklr/video/upload/v1638480908/dark_house_ywgase.mp3", img:"https://res.cloudinary.com/dmtd0lklr/image/upload/v1638482585/darkhouse_rmkbbu.jpg"},
    {name:"BANG BANG", artist:"BIG BANG", fileMp3:"https://res.cloudinary.com/dmtd0lklr/video/upload/v1638480908/bang_bang_ixgadv.mp3",img:"https://res.cloudinary.com/dmtd0lklr/image/upload/v1638482607/bigbang_xzc8ew.jpg"},
    {name:"Adan y Eva", artist:"Paulo Londra", fileMp3:"https://res.cloudinary.com/dmtd0lklr/video/upload/v1638480906/adan_y3nnyx.mp3", img:"https://res.cloudinary.com/dmtd0lklr/image/upload/v1638482552/adan-y-eva_ynejf3.jpg"},
    {name:"Get lucky", artist:"DAFTPUNK", fileMp3:"https://res.cloudinary.com/dmtd0lklr/video/upload/v1638480911/Get-lucky_stcsz9.mp3", img:"https://res.cloudinary.com/dmtd0lklr/image/upload/v1638482580/getlucky_hgxhky.jpg"}
];

const lista= document.querySelector("ul");
const elementHtml= document.createElement("li");
songsList.forEach(item=>{
    const elementHtml= document.createElement("li");
    elementHtml.innerHTML=`
    <img src="${item.img}" alt="">
    <audio src="${item.fileMp3}"></audio>
    <div class="song-information">
    <h4>${item.name}</h4>
    <p>${item.artist}</p>
    </div>
    <div class="ecualizador">
    <div class="barra barra1"></div>
    <div class="barra barra2"></div>
    <div class="barra barra3"></div>
    </div>
    `;
    lista.appendChild(elementHtml);
});

//variables y funciones
let currentSong=0;
const audios=document.querySelectorAll("audio");
const li=document.querySelectorAll("li");
const buttonPlay=document.querySelector(".playAndPause");
const buttonLeft=document.querySelector(".before");
const buttonRight= document.querySelector(".after");
const inputRange=document.querySelector("input");
const darkModeButton=document.querySelector(".checkbox");
let dark=false;

function ActualizarDatos(index)
{
    const imgBox=document.querySelector(".imgbx img");
    const nameSong=document.querySelector(".name-song");
    const artistName=document.querySelector(".artist-name");

    imgBox.src=songsList[index].img;
    gsap.from(".imgbx img",{
        x:"100%",
        opacity:0
    });
    nameSong.textContent=songsList[index].name;
    artistName.textContent=songsList[index].artist;
}

ActualizarDatos(0);

const ConvertTimeInMinutes = (x) => {
    let tiempo = x;
    let minutos = 0;
    let segundos = 0;

    while (tiempo > 0) {
        if (tiempo >= 60) {
            minutos++;
        }
        else {
            segundos = tiempo;
        }
        tiempo = tiempo - 60;
    }

    return `${minutos}:${segundos<10?"0"+segundos:segundos}`


}

//actualizar la barra de rango
function actualizarRango(index)
{
    audios[index].addEventListener("timeupdate", ()=>{
        const audio= audios[index];
        const valorFinal=document.querySelector(".input .right");
        const valorInicial=document.querySelector(".input .left");
        inputRange.max=Math.floor(audios[currentSong].duration);
        valorFinal.textContent=ConvertTimeInMinutes(inputRange.max);
        inputRange.value=audio.currentTime;
        valorInicial.textContent=ConvertTimeInMinutes(inputRange.value);
        if(inputRange.value==parseInt(inputRange.max,10))
        {
            siguienteCancion();
        }
    });
}

function playAndPause()
{
    const song=audios[currentSong];
    const buttonIcon=document.querySelector(".playAndPause i");
    const ecualizador=document.querySelectorAll(".ecualizador");
    
    if(song.paused)
    {
        song.play();
        buttonIcon.classList.add("fa-pause");
        buttonIcon.classList.remove("fa-play");
        ecualizador[currentSong].classList.add("ecualizador-hidden");
    }
    else{
        buttonIcon.classList.add("fa-play");
        buttonIcon.classList.remove("fa-pause");
        song.pause();
        ecualizador[currentSong].classList.remove("ecualizador-hidden");
    }
}


function PausarLista()
{
    const ecualizador=document.querySelectorAll(".ecualizador");
    audios.forEach((item,index)=>{
        item.pause();
        item.currentTime=0;
        ecualizador[index].classList.remove("ecualizador-hidden");
    });
}

function siguienteCancion()
{
    currentSong++;
    if(currentSong>songsList.length-1)
    {
        currentSong=0;
        PausarLista();
        ActualizarDatos(currentSong);
        playAndPause();
        actualizarRango(currentSong);
    } 
    else{
        PausarLista();
        ActualizarDatos(currentSong);
        playAndPause();
        actualizarRango(currentSong);
    }
}


function cancionAnterior()
{
    currentSong--;
    if(currentSong<0)
    {
        currentSong=songsList.length-1;
        PausarLista();
        ActualizarDatos(currentSong);
        playAndPause();
        actualizarRango(currentSong);
    } 
    else{
        PausarLista();
        ActualizarDatos(currentSong);
        playAndPause();
        actualizarRango(currentSong);
    }
}

//este es el boton para reproducir o pausar
buttonPlay.addEventListener("click",()=>{
    playAndPause();
    actualizarRango(currentSong);
});

//este es el boton para pasar a la siguiente cancion
buttonLeft.addEventListener("click",()=>
{
    cancionAnterior();
    
});


//este es el boton para retroceder a la anterior cancion
buttonRight.addEventListener("click", ()=>{
    siguienteCancion();
    actualizarRango(currentSong);
});


//este es el evento al darle click a un elemento de la lista
li.forEach((item,index)=>{
    item.addEventListener("click",()=>{
        currentSong=index;
        PausarLista();
        ActualizarDatos(index);
        playAndPause();
        actualizarRango(index);
    })
});

//eventos para el input

inputRange.addEventListener("input",()=>{
    const value=inputRange.value;
    const span=document.querySelector("span");
    span.classList.add("show");
    span.textContent=ConvertTimeInMinutes(value);
    audios[currentSong].currentTime=value;
    const porcentaje=(value*100)/inputRange.max;
    span.style.left=porcentaje+"%";  
});

inputRange.onblur=()=>{
    const span=document.querySelector("span");
    span.classList.remove("show");

}

//dark-mode o light-mode

darkModeButton.addEventListener("click", ()=>{
    const color=document.querySelector(".change-color");
    const icon=document.querySelector(".switch i");

    if(dark==false)
    {
        dark=true;
        color.href="./css/dark-mode.css";
        icon.classList.add("fa-sun");
        icon.classList.remove("fa-moon");
        gsap.to(".switch",{
            left:"55%",
            ease:"elastic"
        });
        
    }
    else
    {
        dark=false;
        color.href="./css/lighter-mode.css";
        icon.classList.add("fa-moon");
        icon.classList.remove("fa-sun");
        gsap.to(".switch",{
            left:"8%",
            ease:"elastic"
        });
    }
});
