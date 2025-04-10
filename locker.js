const CONFIG = {
    PIN_LENGTH: 4,
    MAX_ATTEMPTS: 5,
    CORRECT_PIN: '1470',
    LOCKOUT_TIME: 30000
};

let currentInput = '';
let attemptsRemaining = CONFIG.MAX_ATTEMPTS;
let isLocked = false;

const pinDots = document.querySelectorAll('.pin-dot');
const keypad = document.querySelector('.keypad');
const attemptsCounter = document.querySelector('.attempts-counter');
const logEntries = document.querySelector('.log-entries');
const modalOverlay = document.querySelector('.modal-overlay');
const modalMessage = document.querySelector('.modal-message');

function createShockwave(x, y) {
    const shockwave = document.createElement('div');
    shockwave.className = 'shockwave';
    shockwave.style.left = `${x}px`;
    shockwave.style.top = `${y}px`;
    document.body.appendChild(shockwave);
    setTimeout(() => shockwave.remove(), 500);
}

function createParticles(x, y) {
    for(let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const angle = (Math.PI * 2 * i) / 12;
        const distance = Math.random() * 50 + 50;
        particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 600);
    }
}

function playErrorSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
}

function showMatrixEffect(element) {
    element.classList.add('error-effect');
    setTimeout(() => element.classList.remove('error-effect'), 1000);
}

function handleFailure(event) {
    const x = event.clientX;
    const y = event.clientY;

    createShockwave(x, y);
    createParticles(x, y);
    showMatrixEffect(document.querySelector('.lock-interface'));
    playErrorSound();

    pinDots.forEach(dot => dot.classList.add('error'));
    setTimeout(() => pinDots.forEach(dot => dot.classList.remove('error')), 500);

    const logHeader = document.querySelector('.log-header');
    logHeader.dataset.text = logHeader.textContent;
    logHeader.classList.add('glitch-text');
    setTimeout(() => logHeader.classList.remove('glitch-text'), 2000);

    document.body.style.transform = 'translateX(0)';
    requestAnimationFrame(() => {
        document.body.style.transform = 'translateX(10px)';
        requestAnimationFrame(() => {
            document.body.style.transform = 'translateX(-10px)';
            requestAnimationFrame(() => {
                document.body.style.transform = 'translateX(0)';
            });
        });
    });

    attemptsRemaining--;
    attemptsCounter.textContent = attemptsRemaining;

    if (attemptsRemaining <= 0) {
        showModal('SYSTEM LOCKED', 'var(--error-color)');
        lockSystem();
    }
}

keypad.addEventListener('click', (e) => {
    if (isLocked) return;
    
    const key = e.target.closest('.key');
    if (!key) return;

    const value = key.dataset.value;
    const action = key.dataset.action;

    if (action === 'delete') {
        currentInput = currentInput.slice(0, -1);
    } else if (action === 'submit') {
        if (currentInput.length === CONFIG.PIN_LENGTH) {
            const timestamp = new Date().toLocaleTimeString();
            const isValid = currentInput === CONFIG.CORRECT_PIN;
            
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry ${isValid ? '' : 'error'}`;
            logEntry.innerHTML = `
                <div class="log-timestamp">${timestamp}</div>
                <div>${isValid ? 'SUCCESS' : 'FAILURE'} - Attempt ${CONFIG.MAX_ATTEMPTS - attemptsRemaining}</div>
                <div>${currentInput.split('').join(' ')}</div>
            `;
            logEntries.prepend(logEntry);

            if (isValid) {
                showModal('ACCESS GRANTED', 'var(--success-color)');
                resetSystem();
            } else {
                handleFailure(e);
            }
            currentInput = '';
        }
    } else if (value && currentInput.length < CONFIG.PIN_LENGTH) {
        currentInput += value;
        const dot = pinDots[currentInput.length - 1];
        dot.style.transform = 'scale(1.2)';
        setTimeout(() => dot.style.transform = 'scale(1)', 100);
    }

    pinDots.forEach((dot, index) => {
        dot.classList.toggle('active', index < currentInput.length);
    });
});

function showModal(message, color) {
    modalMessage.textContent = message;
    modalMessage.style.color = color;
    modalOverlay.style.display = 'flex';
}

function closeModal() {
    modalOverlay.style.display = 'none';
}

function lockSystem() {
    isLocked = true;
    setTimeout(() => {
        resetSystem();
        showModal('SYSTEM RESTORED', 'var(--primary-color)');
    }, CONFIG.LOCKOUT_TIME);
}

function resetSystem() {
    isLocked = false;
    attemptsRemaining = CONFIG.MAX_ATTEMPTS;
    attemptsCounter.textContent = attemptsRemaining;
    logEntries.innerHTML = '';
    currentInput = '';
    pinDots.forEach(dot => dot.classList.remove('active'));
}

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9' && !isLocked) {
        currentInput += e.key;
        const dot = pinDots[currentInput.length - 1];
        dot.style.transform = 'scale(1.2)';
        setTimeout(() => dot.style.transform = 'scale(1)', 100);
        pinDots.forEach((dot, index) => {
            dot.classList.toggle('active', index < currentInput.length);
        });
    }
});


  // Disable right-click
  document.addEventListener('contextmenu', e => e.preventDefault());

  // Disable specific key combinations
  document.addEventListener('keydown', function(e) {
    // Prevent F12
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }

    // Prevent Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
      e.preventDefault();
      return false;
    }

    // Prevent Ctrl+U
    if (e.ctrlKey && e.key.toUpperCase() === 'U') {
      e.preventDefault();
      return false;
    }

    // Prevent Ctrl+S (optional)
    if (e.ctrlKey && e.key.toUpperCase() === 'S') {
      e.preventDefault();
      return false;
    }
  });

  // Prevent drag to new tab (source code view)
  document.addEventListener('dragstart', e => e.preventDefault());

