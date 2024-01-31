let completeSudokuGrid = null;
let currentPossibilities = null;
const cells = document.querySelectorAll(".cell");
const cellSubWriting = document.querySelectorAll(".possibility");
const startButton = document.querySelector(".start");

startButton.addEventListener("click", (e) => {
    completeSudokuGrid = generateCompleteGrid();
    currentPossibilities = findGridPossibilities(completeSudokuGrid);
    cells.forEach(function(cell, index) {
        cell.textContent = completeSudokuGrid[Math.floor(index / 9)][index % 9];
        if (cell.textContent.toString() !== "") {
            cell.style.display = "block";
        }
        else {
            for (let i = 1; i < 10; i++) {
                if (isValidPlacement(completeSudokuGrid, i, Math.floor(index / 9), index % 9)) {
                    const element = document.createElement("div");
                    element.textContent = i.toString();
                    element.className = "possibility";
                    cell.appendChild(element);
                }
            }
        }
    })
    cellSubWriting.forEach(function(clue, index) {
        console.log(Math.floor(index / 81));
        console.log(Math.floor((index % 81) / 9));
        console.log(index % 9);
        console.log(currentPossibilities[Math.floor(index/81)][Math.floor((index % 81) / 9)]);
        console.log(currentPossibilities[Math.floor(index/81)][Math.floor((index % 81) / 9)][(index % 9)]);
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
    //Initialise three squares
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 9; j++) {
            let random = getRandomInt(1,9);
            while (!isValidPlacement(grid, random, 4*i, j)) {
                random = getRandomInt(1,9)
            }
            grid[4*i][j] = random;
        }
    }


    return grid;

}


function findGridPossibilities(grid) {
    const possibilities = [];
    for (let i = 0; i < 9; i++) {
        possibilities.push([]);
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] !== "") {
                possibilities[i].push("x");
            }
            else {
                possibilities[i].push([])
                for (let k = 1; k < 10; k++) {
                    if (isValidPlacement(grid, k, i, j)) {
                        possibilities[i][j].push(k);
                    }
                }
            }
        }
    }
    return possibilities;
}
function isValidPlacement(grid, number, major, minor) {
    const majorRow = Math.floor(major / 3);
    const minorRow = Math.floor(minor/3);
    const majorColumn = major % 3;
    const minorColumn = minor % 3;

    //Check 3x3 cell
    for (let i = 0; i < 9; i++) {
        console.log(grid[major][i].toString() + "=" + number.toString());
        if (grid[major][i].toString() === number.toString()) {
            return false;
        }
    }

    //Check row
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[3*majorRow + i][3*minorRow + j].toString() === number.toString()) {
                return false;
            }
        }
    }

    //Check column
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

