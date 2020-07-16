class AudioVisualizer {
    constructor() {
        this.currentSong = document.querySelector('#song-name');
        this.canvasCtx = document.querySelector('canvas').getContext('2d');
        this.canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
        this.songs = songs;

        this.audio = new Audio();
        this.audio.setAttribute('controls', '');
        this.audio.setAttribute('loop', '');
        this.audio.dataset.songid = 0;
        this.setSong(0);
        this.audio.play();
        document.body.insertAdjacentElement('afterBegin', this.audio);

        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        this.source = this.audioContext.createMediaElementSource(this.audio);

        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        this.drawFrequency();

        // Change song buttons
        document.querySelector('#change-song-buttons').addEventListener('click', this.changeSong.bind(this));
    }

    setSong(songId) {
        this.audio.setAttribute('src', `/resources/music/${songs[songId]}`);
        this.currentSong.textContent = this.songs[songId];
    }

    drawFrequency() {
        this.analyser.fftSize = 256;

        const frequencyArr = new Uint8Array(this.analyser.frequencyBinCount);

        const bufferLength = this.analyser.frequencyBinCount;

        const drawVisual = requestAnimationFrame(this.drawFrequency.bind(this));

        this.analyser.getByteFrequencyData(frequencyArr);

        this.canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        let barWidth = (WIDTH / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = frequencyArr[i];

            this.canvasCtx.fillStyle = `rgb(50,${barHeight+100},50)`;

            this.canvasCtx.fillRect(x, (HEIGHT-barHeight) / 2, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

    drawWave() {
        const waveArr = new Uint8Array(this.analyser.frequencyBinCount);
        const bufferLength = this.analyser.frequencyBinCount;
        const drawVisual = requestAnimationFrame(this.drawWave.bind(this));
        this.analyser.getByteTimeDomainData(waveArr);
        this.canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.strokeStyle = 'black';

        this.canvasCtx.beginPath();

        let sliceWidth = WIDTH * 1.0 / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            let v = waveArr[i] / 128.0;
            let y = v * HEIGHT/2;

            if (i === 0) {
                this.canvasCtx.moveTo(x, y);
            } else {
                this.canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;

        }

        this.canvasCtx.stroke();

        this.canvasCtx.lineTo(WIDTH, HEIGHT / 2);
    }

    changeSong(event) {
        if (event.target.tagName.toLowerCase() != 'button')
            return -1;

        let nextSongId;

        switch (event.target.getAttribute('id')) {
            case 'next-song':
                nextSongId = (parseInt(this.audio.dataset.songid) + 1) % this.songs.length;
                break;
            case 'previous-song':
                nextSongId =
                    !(parseInt(this.audio.dataset.songid)) ?
                    this.songs.length - 1:
                    parseInt(this.audio.dataset.songid) - 1;
                break;
        }

        this.setSong(nextSongId);
        this.audio.dataset.songid = nextSongId;

        this.audio.play();
    }


}