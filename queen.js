let queensPlaced = 0;
        let boardSize = 8;

        function createBoard(size) {
            const board = document.getElementById('board');
            board.innerHTML = '';
            board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
            
            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {
                    const cell = document.createElement('div');
                    cell.className = `cell ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
                    cell.dataset.row = row;
                    cell.dataset.col = col;
                    cell.addEventListener('click', handleClick);
                    board.appendChild(cell);
                }
            }
        }

        function startGame() {
            boardSize = parseInt(document.getElementById('queenCount').value);
            queensPlaced = 0;
            updateQueenCounter(); // Reset the counter
            createBoard(boardSize);
            document.getElementById('message').textContent = '';
        }

        function handleClick(event) {
            const cell = event.target;
            const rect = cell.getBoundingClientRect();
            createParticles(rect.left + 25, rect.top + 25);
            
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);

            if (cell.classList.contains('queen')) {
                cell.textContent = '';
                cell.classList.remove('queen');
                clearAttacked(row, col);
                queensPlaced--;
            } else if (!cell.classList.contains('attacked')) {
                cell.textContent = '♛';
                cell.classList.add('queen');
                markAttacked(row, col);
                queensPlaced++;
            }

            updateQueenCounter(); // Update the counter after placing or removing a queen

            if (queensPlaced === boardSize) {
                document.getElementById('message').textContent = `Congratulations! ${boardSize} Queens placed successfully!`;
                celebrate();
            } else {
                document.getElementById('message').textContent = '';
            }
        }

        function createParticles(x, y) {
            for (let i = 0; i < 8; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.background = `hsl(${Math.random() * 360}, 70%, 50%)`;
                particle.style.width = '8px';
                particle.style.height = '8px';
                particle.style.borderRadius = '50%';
                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 1000);
            }
        }

        function markAttacked(row, col) {
            const cells = document.querySelectorAll('.cell');
            cells.forEach(cell => {
                const r = parseInt(cell.dataset.row);
                const c = parseInt(cell.dataset.col);
                
                if (r === row || c === col || (r - c) === (row - col) || (r + c) === (row + col)) {
                    cell.classList.add('attacked');
                }
            });
        }

        function clearAttacked(row, col) {
            const cells = document.querySelectorAll('.cell');
            cells.forEach(cell => {
                const r = parseInt(cell.dataset.row);
                const c = parseInt(cell.dataset.col);

                let isStillAttacked = false;
                document.querySelectorAll('.queen').forEach(queenCell => {
                    const qr = parseInt(queenCell.dataset.row);
                    const qc = parseInt(queenCell.dataset.col);
                    if (qr === r || qc === c || (qr - qc) === (r - c) || (qr + qc) === (r + c)) {
                        isStillAttacked = true;
                    }
                });

                if (!isStillAttacked) {
                    cell.classList.remove('attacked');
                }
            });
        }

        function resetBoard() {
            const cells = document.querySelectorAll('.cell');
            cells.forEach(cell => {
                cell.classList.remove('queen', 'attacked');
                cell.textContent = '';
            });
            queensPlaced = 0;
            updateQueenCounter(); // Reset the counter
            document.getElementById('message').textContent = '';
        }

        function celebrate() {
            const count = 200;
            const defaults = {
                origin: { y: 0.7 }
            };

            function fire(particleRatio, opts) {
                confetti(Object.assign({}, defaults, opts, {
                    particleCount: Math.floor(count * particleRatio)
                }));
            }

            fire(0.25, { spread: 26, startVelocity: 55 });
            fire(0.2, { spread: 60 });
            fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
            fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
            fire(0.1, { spread: 120, startVelocity: 45 });
        }

        function updateQueenCounter() {
            const queenCounterElement = document.getElementById('queenCounter');
            if (queenCounterElement) {
                queenCounterElement.textContent = `Queens Placed: ${queensPlaced}/8`;
            }
        }

        createBoard(8);
