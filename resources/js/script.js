
const initAudioVisualizer = () => {
    const audioVisualizer = new AudioVisualizer({
        'songTitle': songTitle,
        'audio': audio,
        'canvas': canvas,
        'songFileInput': songFileInput
    });

    songFileInput.removeEventListener('click', initAudioVisualizer);
}

const audio = document.querySelector('audio');
const canvas = document.querySelector('canvas');
const songFileInput = document.querySelector('#songFileInput');
const songTitle = document.querySelector('#song-title');

songFileInput.addEventListener('click', initAudioVisualizer);
