
    function displaySignature(e) {
      const nameInput = document.getElementById('nameInput').value.trim();
      const signatureDisplay = document.getElementById('signatureDisplay');
      const fontStyle = document.getElementById('fontSelector').value;
      const btn = e.currentTarget;
      const loader = btn.querySelector('.loader');
      const btnText = btn.querySelector('.btn-text');

      if (nameInput === '') {
        alert('Please enter your name!');
        return;
      }

      // Show loader
      btnText.style.display = 'none';
      loader.style.display = 'block';
      btn.style.opacity = '0.7';

      // Create ripple effect
      const ripple = document.createElement('div');
      ripple.className = 'ripple';
      ripple.style.left = `${e.clientX - btn.offsetLeft}px`;
      ripple.style.top = `${e.clientY - btn.offsetTop}px`;
      btn.appendChild(ripple);

      setTimeout(() => {
        // Generate signature
        signatureDisplay.textContent = '';
        void signatureDisplay.offsetWidth;
        const variations = ['variation-1', 'variation-2', 'variation-3'];
        signatureDisplay.className = `signature ${fontStyle} ${variations[Math.floor(Math.random() * variations.length)]}`;
        signatureDisplay.textContent = nameInput;

        // Restart animations
        signatureDisplay.style.animation = 'none';
        setTimeout(() => {
          signatureDisplay.style.animation = 'typing 2s steps(30, end), blink-caret 0.75s step-end infinite, signature-fade 0.5s ease-in, float 3s ease-in-out infinite';
        }, 10);

        // Hide loader and show download button
        btnText.style.display = 'block';
        loader.style.display = 'none';
        btn.style.opacity = '1';
        document.getElementById('downloadBtn').style.display = 'inline-block';
      }, 1000);
    }

    // Function to download the signature
    async function downloadSignature() {
      const signatureDisplay = document.getElementById('signatureDisplay');

      // Temporarily disable animations and transformations
      signatureDisplay.style.animation = 'none';
      signatureDisplay.style.transform = 'none';

      // Wait for fonts to load
      await new Promise((resolve) => {
        document.fonts.ready.then(resolve);
      });

      // Capture the signature using html2canvas
      html2canvas(signatureDisplay, {
        scale: 2, // Increase resolution for better quality
        allowTaint: true,
        useCORS: true,
      }).then(canvas => {
        // Re-enable animations and transformations
        signatureDisplay.style.animation = '';
        signatureDisplay.style.transform = '';

        // Convert canvas to image and trigger download
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'signature.png';
        link.click();
      });
    }