document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const context = canvas.getContext('2d');
    const startButton = document.getElementById('start-button');
    const difficultySlider = document.getElementById('difficulty-slider');
    const difficultyLabel = document.getElementById('difficulty-label');
    const messageDiv = document.getElementById('message');
    const moveCounter = document.getElementById('move-counter');

    let size = 5; // default grid size
    let grid = [];
    let gameOver = false;
    let moveCount = 0;
    const difficulties = ['超易', '较易', '中等', '较难', '超难'];

    difficultySlider.addEventListener('input', (event) => {
        difficultyLabel.textContent = difficulties[event.target.value - 1];
        size = parseInt(event.target.value) + 4;  // Adjust grid size based on difficulty
    });

    startButton.addEventListener('click', () => {
        messageDiv.textContent = '';
        moveCount = 0;
        moveCounter.textContent = `步数 = ${moveCount}`;
        initializeGame();
        draw();
    });

    canvas.addEventListener('click', (event) => {
        if (gameOver) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = Math.floor((event.clientX - rect.left) * scaleX / (canvas.width / size));
        const y = Math.floor((event.clientY - rect.top) * scaleY / (canvas.height / size));

        if (x < size && y < size) {
            toggleLights(x, y);
            draw();
            moveCount++;
            moveCounter.textContent = `步数 = ${moveCount}`;
            if (checkWin()) {
                gameOver = true;
                showResult('✔️', 'green');
                messageDiv.innerHTML = `<span style="color: green;">恭喜成功！一共用了${moveCount}步。</span>`;
            }
        }
    });

    function initializeGame() {
        // Start with all lights off (false)
        grid = Array.from({ length: size }, () => Array(size).fill(false));
        gameOver = false;

        // Randomly toggle some lights to create a solvable puzzle
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (Math.random() < 0.5) {
                    toggleLights(i, j);
                }
            }
        }
    }

    function draw() {
        const cellSize = Math.min(canvas.width, canvas.height) / size;
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                context.fillStyle = grid[y][x] ? 'yellow' : 'black';
                context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                context.strokeStyle = 'white';
                context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }

    function toggleLights(x, y) {
        const directions = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
                grid[ny][nx] = !grid[ny][nx];
            }
        }
    }

    function checkWin() {
        return grid.every(row => row.every(cell => !cell));
    }

    function showResult(result, color) {
        context.fillStyle = color;
        context.font = '40px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(result, canvas.width / 2, canvas.height / 2);
    }

    // Initialize game
    canvas.width = window.innerWidth * 0.9;
    canvas.height = canvas.width; // Make sure the canvas is a square
    initializeGame();
    draw();
});