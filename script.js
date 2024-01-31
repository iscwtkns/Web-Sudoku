let completeSudokuGrid = null;
let currentPossibilities = null;
let currentGrid = null;
let previousSteps = [];
let difficulty = 5;
let selectedCell = null;
const cells = document.querySelectorAll(".cell");
const cellSubWriting = document.querySelectorAll(".possibility");
const startButton = document.querySelector(".start");

cells.forEach(function(cell) {
    cell.addEventListener("click", (e) => {
        if (selectedCell !== null) {
            selectedCell.style.backgroundColor = "white";
        }
        selectedCell = cell;
        cell.style.backgroundColor = "aqua";
    })
})

function drawGrid(grid) {
    cells.forEach(function(cell, index) {
        cell.textContent = grid[Math.floor(index / 9)][index % 9];
        if (cell.textContent.toString() !== "") {
            cell.style.display = "block";
        }
        else {
            cell.style.display = "grid";
        }
    })
}

function fillSmallNumbers(grid) {
    cells.forEach(function (cell, index) {
        if (cell.textContent.toString() !== "") {
            cell.style.display = "block";
        }
        else {
            cell.style.display = "grid";
            for (let i = 1; i < 10; i++) {
                if (isValidPlacement(grid, i, Math.floor(index / 9), index % 9)) {
                    const element = document.createElement("div");
                    element.textContent = i.toString();
                    element.className = "possibility";
                    cell.appendChild(element);
                }
            }
        }
    })
}
startButton.addEventListener("click", (e) => {
    cells.forEach(function(cell) {
        cell.style.backgroundColor = "white";
    })
    completeSudokuGrid = generateCompleteGrid();
    currentPossibilities = findGridPossibilities(completeSudokuGrid);
    currentGrid = prepareGrid(completeSudokuGrid, difficulty);
    drawGrid(currentGrid);
})

function prepareGrid(grid, difficulty) {
    let newGrid = grid;
    for (let squaresToLose = 46 + difficulty; squaresToLose >= 0; squaresToLose--) {
        let random = getRandomInt(0, 80);
        while (newGrid[Math.floor(random / 9)][random % 9] === "") {
            random = getRandomInt(0, 80);
        }
        newGrid[Math.floor(random / 9)][random % 9] = "";
    }
    return newGrid;
}
function findRecursiveSolution(grid) {
    const nextCellsToFill = findCellsWithLeastPossibilities(grid);

    // Base Case: If there are no cells to fill, return the grid
    if (nextCellsToFill.length === 0) {
        return grid;
    }

    for (const cell of nextCellsToFill) {
        const pos = findPosition(cell);
        const allPossibilities = findGridPossibilities(grid);
        const choices = allPossibilities[pos[0]][pos[1]];

        // Base Case: If there are no choices for a cell, return null (indicating failure)
        if (choices.length === 0) {
            return null;
        }

        // Try each possibility for the cell
        for (const number of choices) {
            const newGrid = grid.map(row => [...row]); // Create a deep copy of the grid
            newGrid[pos[0]][pos[1]] = number.toString();

            // Recursively call the function with the new grid
            const result = findRecursiveSolution(newGrid);
            if (result !== null) {
                return result; // Return the grid if a solution is found
            }
        }
        return null; // If none of the choices lead to a solution, return null
    }
}
/*
function findRecursiveSolution(grid) {
    const nextCellsToFill = findCellsWithLeastPossibilities(grid);
    const allPossibilities = findGridPossibilities(grid);
    let choices = 0;
    cells.forEach(function (cell, index) {
        if (nextCellsToFill.includes(cell)) {
            choices = allPossibilities[Math.floor(index / 9)][index % 9].length;
        }
    })

    //Base Case
    if (nextCellsToFill.length === 0) {
        console.log("finished generating");
        return grid;
    }

    if (choices === 0) {
        reverseSteps(grid);
        previousSteps = [];
        return findRecursiveSolution(grid);
    }
    if (choices === 1) {
        for (let i = 0; i < nextCellsToFill.length; i++) {
            const pos = findPosition(nextCellsToFill[i]);
            previousSteps.push(pos);
            if (isValidPlacement(grid, allPossibilities[pos[0]][pos[1]][0], pos[0], pos[1])) {
                grid[pos[0]][pos[1]] = allPossibilities[pos[0]][pos[1]][0].toString();
            }
            else {
                reverseSteps(grid);
                previousSteps = [];
                return findRecursiveSolution(grid);
            }
        }
    }
    if (choices >= 1) {
        const randomCell = getRandomInt(0, nextCellsToFill.length-1);
        const cellToUpdate = nextCellsToFill[randomCell];
        const pos = findPosition(cellToUpdate);
        const randomNum = allPossibilities[pos[0]][pos[1]][getRandomInt(0, allPossibilities[pos[0]][pos[1]].length-1)];
        if (isValidPlacement(grid, randomNum, pos[0], pos[1])) {
            grid[pos[0]][pos[1]] = randomNum;
            drawGrid(grid);
            return findRecursiveSolution(grid);
        }
    }
}
*/
function findPosition(cell) {
    for (let index = 0; index < cells.length; index++) {
        if (cells[index] === cell) {
            return [Math.floor(index / 9), index % 9];
        }
    }
    // Return null if the cell is not found
    return null;
}
function reverseSteps(grid) {
    for (let i = 0; i < previousSteps.length; i++) {
        grid[previousSteps[i][0]][previousSteps[i][1]] = "";
    }
}
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
    return findRecursiveSolution(grid);
}


function findCellsWithLeastPossibilities(grid) {
    const allPossibilities = findGridPossibilities(grid);
    let leastPossibilities = 9;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (allPossibilities[i][j].toString() === "x") {
                continue;
            }
            if (allPossibilities[i][j].length < leastPossibilities) {
                leastPossibilities = allPossibilities[i][j].length;
            }
        }
    }
    let cellsWithLeast = [];
    cells.forEach(function (cell, index) {
        if (allPossibilities[Math.floor(index / 9)][index % 9].toString() === "x") {
            return;
        }
        if (allPossibilities[Math.floor(index / 9)][index % 9].length === leastPossibilities) {
            cellsWithLeast.push(cell);
        }
    })
    return cellsWithLeast;
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

