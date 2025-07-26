let n = getInput();
let map = createMap(n);


for (let i = 0; i < 20;i++) {
    generateBomb(map,n);
}
printMap(map);

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

