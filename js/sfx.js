// File: /js/sfx.js

// Hover sound for all buttons
const buttons = document.querySelectorAll('.cyber-button');
const hoverSound = new Audio('./assets/audio/hover.mp3');

buttons.forEach(button => {
  button.addEventListener('mouseenter', () => {
    hoverSound.currentTime = 0; // Reset sound if already playing
    hoverSound.play();
  });
});