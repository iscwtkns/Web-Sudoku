let completeSudokuGrid = null;
const cells = document.querySelectorAll(".cell");
const startButton = document.querySelector(".start");
startButton.addEventListener("click", (e) => {
    completeSudokuGrid = generateCompleteGrid();
    cells.forEach(function(cell, index) {
        cell.textContent = completeSudokuGrid[Math.floor(index / 9)][index % 9];
    })
})

function generateCompleteGrid() {

    //Initialising 9x9 array with empty strings
    const grid = [];
    for (let i = 0; i < 9; i++) {
        grid.push([]);
        for (let j = 0; j < 9; j++) {
            grid[i].push("");
        }
    }

    //Generate three squares
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 9; j++) {
            let random = getRandomInt(1,9);
            while (!isValidPlacement(grid, random, 4*i, j)) {
                random = getRandomInt(1,9);
            }
            grid[4*i][j] = random;
        }
    }

    /* This is the bugged function that causes it to crash
    //Generate next two squares
    for (let i = 0; i < 2; i++) {
        console.log("Attempting look at square " + (2+6*i));
        for (let j = 0; j < 9; j++) {
            let random = getRandomInt(1,9);
            while (!isValidPlacement(grid, random, 2+6*i, j)) {
                console.log("Duplicate found");
                random = getRandomInt(1,9);
            }
            grid[2+6*i][j] = random;
        }
    }

     */

    return grid;

}

function isValidPlacement(grid, number, major, minor) {
    const majorRow = Math.floor(major / 3);
    const minorRow = Math.floor(minor/3);
    const majorColumn = major % 3;
    const minorColumn = minor % 3;

    //Check 3x3 cell
    console.log("Checking for duplicates in 3x3")
    for (let i = 0; i < 9; i++) {
        console.log(grid[major][i].toString() + "=" + number.toString());
        if (grid[major][i].toString() === number.toString()) {
            return false;
        }
    }

    //Check row
    console.log("Checking for duplicates in row")
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            console.log("row contains " + grid[3*majorRow+i][3*minorRow +j]);
            if (grid[3*majorRow + i][3*minorRow + j].toString() === number.toString()) {
                return false;
            }
        }
    }

    //Check column
    console.log("Checking for duplicates in column")
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[3*i + majorColumn][3*j + minorColumn].toString() === number.toString()) {
                return false;
            }
        }
    }

    return true;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}