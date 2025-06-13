// File: /js/voice-control.js

const voiceButton = document.getElementById('voice-command');
const hoverSound = new Audio('./assets/audio/hover.wav');

// Play sound on hover
voiceButton.addEventListener('mouseenter', () => {
  hoverSound.play();
});

// Voice recognition logic (existing code)
voiceButton.addEventListener('click', () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    if (command.includes('rotate')) {
      console.log("Rotating model...");
    }
  };
  recognition.start();
});