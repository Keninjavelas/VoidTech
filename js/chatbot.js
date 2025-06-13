document.addEventListener('DOMContentLoaded', () => {
  // Create chatbot container
  const chatbot = document.createElement('div');
  chatbot.className = 'chatbot-ui';

  // Chatbot HTML structure
  chatbot.innerHTML = `
    <div class="chatbot-header">
      <span class="pulse">VOIDTECH AI</span>
      <span class="status-indicator"></span>
    </div>
    <div class="chatbot-messages">
      <div class="message ai">
        <div class="message-content">
          <span class="typing-indicator"></span>
          <p>SYSTEM INITIALIZED. HOW MAY I ASSIST?</p>
        </div>
      </div>
    </div>
    <div class="chatbot-input-container">
      <input type="text" class="chatbot-input" placeholder="[QUERY_INPUT]">
      <button class="cyber-button send-button">
        <span class="glow">SEND</span>
      </button>
      <button class="cyber-button clear-button">
        <span class="glow">CLEAR</span>
      </button>
    </div>
  `;

  // Add to DOM
  document.body.appendChild(chatbot);

  const inputField = chatbot.querySelector('.chatbot-input');
  const sendButton = chatbot.querySelector('.send-button');
  const clearButton = chatbot.querySelector('.clear-button');
  const messagesContainer = chatbot.querySelector('.chatbot-messages');
  const statusIndicator = chatbot.querySelector('.status-indicator');

  // Text-to-speech
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  // Simulate AI response with random phrases
  const responses = [
    "REQUEST PROCESSED. NEED FURTHER ASSISTANCE?",
    "CONFIRMATION RECEIVED. AWAITING NEXT COMMAND.",
    "SYSTEM ONLINE. HOW CAN I HELP?",
    "COMMAND EXECUTED. NEXT?"
  ];

  function simulateTyping() {
    statusIndicator.classList.add('thinking');
    setTimeout(() => {
      statusIndicator.classList.remove('thinking');
      const response = responses[Math.floor(Math.random() * responses.length)];
      addMessage("AI", response);
      speak(response);
    }, 1200);
  }

  function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender.toLowerCase()}`;
    messageDiv.innerHTML = `
      <div class="message-content">
        <p>${text}</p>
      </div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function handleSend() {
    const message = inputField.value.trim();
    if (message) {
      addMessage("user", message);
      inputField.value = '';
      simulateTyping();
    }
  }

  sendButton.addEventListener('click', handleSend);
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  clearButton.addEventListener('click', () => {
    messagesContainer.innerHTML = '';
    addMessage("AI", "MEMORY PURGED. READY FOR NEW INSTRUCTIONS.");
  });

  setInterval(() => {
    const pulse = chatbot.querySelector('.pulse');
    pulse.style.textShadow = `0 0 ${5 + Math.random() * 5}px #00ffff`;
  }, 1000);

  // Optional: Load previous messages
  const saved = sessionStorage.getItem('chatHistory');
  if (saved) messagesContainer.innerHTML = saved;

  // Save chat history
  const observer = new MutationObserver(() => {
    sessionStorage.setItem('chatHistory', messagesContainer.innerHTML);
  });

  observer.observe(messagesContainer, { childList: true, subtree: true });
});
