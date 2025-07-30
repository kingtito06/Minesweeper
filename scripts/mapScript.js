const n = 20;
const bombCount = 40;
const map = createMap(n);

for (let i = 0; i < bombCount;i++) {
    generateBomb(map,n);
}

printMap(map);
renderBoard(map);

function renderBoard(map) {
    const board = document.getElementById("board");
    board.style.gridTemplateColumns = `repeat(${map.length}, 30px)`;
    board.innerHTML = ""; // clear before re-rendering

    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map.length; col++) {
            const tile = document.createElement("div");
            tile.className = "tile";
            tile.dataset.row = row;
            tile.dataset.col = col;
            tile.classList.add(`tilebg-${(row+col)%2}`);

            tile.addEventListener("click" ,() => {
                revealTile(tile, map);

            });

            tile.addEventListener("contextmenu", (e) => {
                e.preventDefault(); // prevent default right-click menu
                toggleFlag(tile);
            });

            board.appendChild(tile);
        }
    }
}

function toggleFlag(tile) {
    if (tile.classList.contains("revealed")) return;
    
    if (tile.classList.contains("flagged")) {
        tile.classList.remove("flagged");
        tile.textContent = "";
    } else {
        tile.classList.add("flagged");
        tile.textContent = "🚩";
    }
}

function revealTile(tile, map) {
    const row = parseInt(tile.dataset.row);
    const col = parseInt(tile.dataset.col);
    const value = map[row][col];

    if (tile.classList.contains(`revealed-${(row+col)%2}`)) return;

    tile.classList.remove(`tilebg-${(row+col)%2}`);
    tile.classList.add(`revealed-${(row+col)%2}`);

    if (value === -1) {
        tile.classList.add("bomb");
        tile.textContent = "💣";
        alert("Game Over!");
    } else if (value > 0) {
        tile.textContent = value;
        tile.classList.add(`tile-${value}`);
    } else {
        tile.classList.remove(`revealed-${(row+col)%2}`);
        floodReveal(row, col, map);
    }
}

function floodReveal(row, col, map) {
    // Out of bounds
    if (
        row < 0 || row >= map.length ||
        col < 0 || col >= map[0].length
    ) return;

    const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (!tile) return;

    const value = map[row][col];
    if (value === -1) return;

    if (tile.classList.contains(`revealed-${(row+col)%2}`)) return;

    tile.classList.remove(`tilebg-${(row+col)%2}`);
    tile.classList.add(`revealed-${(row+col)%2}`);

    if (value > 0) {
        tile.textContent = value;
        tile.classList.add(`tile-${value}`);
        return;
    }

    const directions = [
        [-1, 0], [1, 0],  // up, down
        [0, -1], [0, 1],  // left, right
        [1, 1], [1, -1],  // right-down, right-up
        [-1, 1], [-1, -1],  // left-down, left-up
    ];

    for (const [dx, dy] of directions) {
        floodReveal(row + dx, col + dy, map);
    }
}

function getInput() {
    return parseInt(prompt("What will n be in the n x n matrix",10));
}

function printMap(map) {
    console.log(map);
}

function createMap(n) {
// creating two-dimensional array
    let map = [];
    for (let i = 0; i < n; i++) {
        map[i] = [];
            for (let j = 0; j < n; j++) {
                map[i][j] = 0;
        }
    }
    return map;
}

function generateBomb(map,n) {
    let row, col;

    // Find a random empty tile (not a bomb)
    do {
        row = Math.floor(Math.random() * n);
        col = Math.floor(Math.random() * n);
        console.log(`Trying position: (${row}, ${col})`);
    } while (map[row][col] === -1);
    
    map[row][col] = -1; // bomb;
    incrementTiles(map,row,col,n);
}

function incrementTiles(map,row,col,n) {
        const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [ 0, -1],          [ 0, 1],
        [ 1, -1], [ 1, 0], [ 1, 1],
    ];

    for (const [dx, dy] of directions) {
        const newRow = dx +row;
        const newCol = dy + col;

        if (newRow >= 0 && newRow < n &&
            newCol >=0 && newCol < n &&
            map[newRow][newCol]!=-1
        ) {
            map[newRow][newCol]++;
        }
    }
}