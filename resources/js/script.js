import AudioVisualizer from '/resources/js/classes/AudioVisualizer.js';

const audio = new Audio();
const canvas = document.querySelector('canvas');
const nextSongButton = document.querySelector('#next-song');
const previousSongButton = document.querySelector('#previous-song');

const audioVisualizer = new AudioVisualizer({
                                            'audio': audio,
                                            'canvas': canvas,
                                            'nextSongButton': nextSongButton,
                                            'previousSongButton': previousSongButton
                                            }, music);

// // Change visualisation type (vawe/frequency)
// document.querySelector('#draw-type').addEventListener('click', (event) => {
//     if (event.target.tagName.toLowerCase() != 'button')
//         return -1;
//
//     canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
//
//     switch (event.target.getAttribute('id')) {
//         case 'draw-type-wave':
//             drawWave();
//             break;
//
//         case 'draw-type-frequency':
//             drawFrequency();
//             break;
//     }
// });
