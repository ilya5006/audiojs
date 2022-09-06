class AudioVisualizer {
    /**
     *
     * @param DOMElements {
     *    songTitle - element which will be show song title;
     *    audio - audio element which will be use for taking audiostream;
     *    canvas - canvas element which contains the canvas and will be using for draw animation;
     *    songFileInput - input (type=file) which using for getting user song;
     * }
     */
    constructor(DOMElements) {
        this.songTitle = DOMElements.songTitle;

        this.WIDTH = DOMElements.canvas.getAttribute('width');
        this.HEIGHT = DOMElements.canvas.getAttribute('height');

        this.canvasCtx = DOMElements.canvas.getContext('2d');
        this.canvasCtx.clearRect(0, 0, this.WIDTH, this.HEIGHT);

        this.audio = DOMElements.audio;
        
        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        this.source = this.audioContext.createMediaElementSource(this.audio);

        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        this.drawFrequency();

        DOMElements.songFileInput.addEventListener('input', this.updateSong.bind(this));
    }

    isAudioFile(file) {
        return file.type.indexOf('audio') !== -1;
    }

    async updateSong(event) {
        const file = event.target.files[0];

        if (! this.isAudioFile(file)) {
            throw new Error('Загружаемый вами файл не является звуковым');
        }

        this.audio.setAttribute('src', URL.createObjectURL(file));
        this.audio.play();

        this.songTitle.textContent = event.target.files[0].name;
    }

    drawFrequency() {
        this.analyser.fftSize = 512;

        const frequencyArr = new Uint8Array(this.analyser.frequencyBinCount);

        const bufferLength = this.analyser.frequencyBinCount;

        const drawVisual = requestAnimationFrame(this.drawFrequency.bind(this));

        this.analyser.getByteFrequencyData(frequencyArr);

        this.canvasCtx.fillStyle = 'rgba(0, 0, 0, 0)';

        this.canvasCtx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        this.canvasCtx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

        if (! this.colorShift || this.colorShift > 360) {
            this.colorShift = 0;
        }

        let barWidth = (this.WIDTH / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        const MAX_HEIGHT = 255;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = frequencyArr[i];

            this.canvasCtx.fillStyle = `hsl(
                ${(360 / bufferLength * i) + this.colorShift},
                ${100 / bufferLength * frequencyArr[i]}%,
                ${100 / MAX_HEIGHT * frequencyArr[i]}%
            )`;

            this.canvasCtx.fillRect(x, (this.HEIGHT - barHeight) / 2, barWidth, barHeight);

            x += barWidth + 1;
        }

        this.colorShift += 1;
    }

}
