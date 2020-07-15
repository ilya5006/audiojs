const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const setSong = (songId) => {
    audio.setAttribute('src', `/music/${songs[songId]}`);
    currentSong.textContent = songs[songId];
}

const drawWave = () => {
    const waveArr = new Uint8Array(analyser.frequencyBinCount);
    const bufferLength = analyser.frequencyBinCount;
    drawVisual = requestAnimationFrame(drawWave);
    analyser.getByteTimeDomainData(waveArr);
    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'black';

    canvasCtx.beginPath();

    let sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        let v = waveArr[i] / 128.0;
        let y = v * HEIGHT/2;

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;

    }

    canvasCtx.stroke();

    canvasCtx.lineTo(WIDTH, HEIGHT / 2);
}

const drawFrequency = () => {
    analyser.fftSize = 256;

    window.frequencyArr = new Uint8Array(analyser.frequencyBinCount);

    const bufferLength = analyser.frequencyBinCount;

    drawVisual = requestAnimationFrame(drawFrequency);

    analyser.getByteFrequencyData(frequencyArr);

    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    let barWidth = (WIDTH / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = frequencyArr[i];

        canvasCtx.fillStyle = `rgb(50,${barHeight+100},50)`;

        canvasCtx.fillRect(x, (HEIGHT-barHeight) / 2, barWidth, barHeight);

        x += barWidth + 1;
    }
}

const currentSong = document.querySelector('p');
const canvasCtx = document.querySelector('canvas').getContext('2d');

const WIDTH = document.querySelector('canvas').getAttribute('width');
const HEIGHT = document.querySelector('canvas').getAttribute('height');

const audio = new Audio();

// Init
canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
setSong(0);
audio.play();
audio.setAttribute('controls', '');
audio.setAttribute('loop', '');
audio.dataset.songid = 0;
document.body.insertAdjacentElement('afterBegin', audio);

// Change song
document.querySelector('#change-song-buttons').addEventListener('click', (event) => {
    if (event.target.tagName.toLowerCase() != 'button') 
        return -1;

    let nextSongId;
    
    switch (event.target.getAttribute('id')) {
        case 'next-song':
            nextSongId = (parseInt(audio.dataset.songid) + 1) % songs.length;
            break;
        case 'previous-song':
            nextSongId = 
                !(parseInt(audio.dataset.songid)) ?
                songs.length - 1:
                parseInt(audio.dataset.songid) - 1;
            break;
    }

    setSong(nextSongId);
    audio.dataset.songid = nextSongId;

    audio.play();
});

// Change visualisation type (vawe/frequency)
document.querySelector('#draw-type').addEventListener('click', (event) => {
    if (event.target.tagName.toLowerCase() != 'button') 
        return -1;

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    switch (event.target.getAttribute('id')) {
        case 'draw-type-wave':
            drawWave();
            break;

        case 'draw-type-frequency':
            drawFrequency();
            break;
    }
});


// Creating thing that show frequency
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audio);

source.connect(analyser);
analyser.connect(audioContext.destination);

// drawWave();
drawFrequency();
