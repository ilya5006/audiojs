const WIDTH = document.querySelector('canvas').getAttribute('width');
const HEIGHT = document.querySelector('canvas').getAttribute('height');

const audioVisualizer = new AudioVisualizer();

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
