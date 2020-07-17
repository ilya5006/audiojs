export default class AudioVisualizer {
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

    fileIsAudio(file) {
        return file.type.indexOf('audio') !== -1;
    }

    async updateSong(event) {
        const file = event.target.files[0];

        if (!this.fileIsAudio(file)) {
            throw new Error('Загружаемый вами файл не является звуковым');
        }

        const formData = new FormData();

        formData.append('song', file);

        const fetchResponse = await fetch('/resources/php/get-song-data.php', {method: 'POST', body: formData});
        const songData = await fetchResponse.blob();

        this.audio.setAttribute('src', URL.createObjectURL(songData));
        this.audio.play();

        this.songTitle.textContent = event.target.files[0].name;
    }

    drawFrequency() {
        this.analyser.fftSize = 256;

        const frequencyArr = new Uint8Array(this.analyser.frequencyBinCount);

        const bufferLength = this.analyser.frequencyBinCount;

        const drawVisual = requestAnimationFrame(this.drawFrequency.bind(this));

        this.analyser.getByteFrequencyData(frequencyArr);

        this.canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        this.canvasCtx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

        let barWidth = (this.WIDTH / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = frequencyArr[i];

            this.canvasCtx.fillStyle = `rgb(50,${barHeight+100},50)`;

            this.canvasCtx.fillRect(x, (this.HEIGHT - barHeight) / 2, barWidth, barHeight);

            x += barWidth + 1;
        }

    }

}