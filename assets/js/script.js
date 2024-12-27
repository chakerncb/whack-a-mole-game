function getRandomCellId() {
    const rows = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--rows'));
    const cols = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cols'));
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    return `${row}${col}`;
}

function showRandomMole() {
    // Hide all moles
    const cells = document.querySelectorAll('td img');
    cells.forEach(cell => cell.style.display = 'none');

    // Show a random mole
    const randomCellId = getRandomCellId();
    const randomCell = document.getElementById(randomCellId).querySelector('img');
    randomCell.style.display = 'block';
}

let gameInterval;
let gameTimeout;
let timeInterval;

function createMoleHoles(rows, cols) {
    var rows = rows;
    var cols = cols;
    const table = document.querySelector('table');
    table.innerHTML = ''; // Clear existing cells
    document.documentElement.style.setProperty('--rows', rows);
    document.documentElement.style.setProperty('--cols', cols);

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('td');
            cell.id = `${i}${j}`;
            cell.onclick = () => clickCell(i, j);
            const img = document.createElement('img');
            img.src = './assets/images/mole-svgrepo-com.svg';
            img.style.display = 'none';
            cell.appendChild(img);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function startGame(duration, rows, cols, speed) {
    score = 0;
    document.getElementById('endScore').innerHTML = score;
    document.getElementById('time').innerHTML = formatTime(duration);
    document.getElementById('start').disabled = true;
    document.getElementsByClassName('startBar')[0].classList.add('hidden');
    document.getElementById('startAnimImg').style.display = 'none';
    document.body.classList.add('no-blur');

    createMoleHoles(rows, cols);

    gameInterval = setInterval(showRandomMole, speed);
    gameTimeout = setTimeout(endGame, duration * 1000);

    let timeLeft = duration;
    timeInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time').innerHTML = formatTime(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timeInterval);
        }
    }, 1000);
}

let topScore = 0;

function updateTopScore() {
    if (score > topScore) {
        topScore = score;
        document.getElementById('endTopScore').innerHTML = topScore;
    }
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(timeInterval);
    updateTopScore();
    document.getElementById('start').disabled = false;
    document.body.classList.remove('no-blur');
    document.getElementById('endBar').style.display = 'block';
    document.getElementById('endScore').innerHTML = score;
    if (topScore > 0) {
        document.getElementById('animationImg').style.display = 'block';
    }
    else {
        document.getElementById('startAnimImg').style.display = 'block';
    }
}

function restartGame() {
    clearInterval(gameInterval);
    clearTimeout(gameTimeout);
    clearInterval(timeInterval);
    document.getElementById('endBar').style.display = 'none';
    document.getElementById('animationImg').style.display = 'none';
    document.getElementById('start').disabled = false;
    document.getElementById('score').innerHTML = 0;
    document.body.classList.add('no-blur');
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    const duration = parseInt(document.getElementById('gameDuration').value);
    const speed = parseInt(document.getElementById('speed').value);

    createMoleHoles(rows, cols);
    startGame(duration, rows, cols, speed);
}

let score = 0;

function clickCell(a, b) {
    const scoreElement = document.getElementById('endScore');
    const cellId = `${a}${b}`;
    const cell = document.getElementById(cellId);

    if (cell.querySelector('img').style.display === 'block') {
        cell.querySelector('img').style.display = 'none';
        score++;
        const audio = new Audio('./assets/audio/sfx_hit.ogg');
        audio.play();
        scoreElement.innerHTML = score;
        document.getElementById('score').innerHTML = score;
        cell.style.backgroundColor = '8B4513';
    } else {
        scoreElement.innerHTML = score;
        document.getElementById('endScore').innerHTML = score;
        cell.style.backgroundColor = '8B4513';
    }
}

function showSettings() {
    document.getElementById('settingsBar').style.display = 'block';
}

function hideSettings() {
    document.getElementById('settingsBar').style.display = 'none';
}

function goHome() {
    location.reload();
}