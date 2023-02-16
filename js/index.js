// Global Variables
const MAZE_SIZE = 30
let START = {
    x:Math.min(Math.floor(1* MAZE_SIZE / 10),MAZE_SIZE-1), 
    y:Math.min(Math.floor(1* MAZE_SIZE / 10),MAZE_SIZE-1), 
}

let GOAL = {
    x:Math.min(Math.floor(8* MAZE_SIZE / 10),MAZE_SIZE-1), 
    y:Math.min(Math.floor(8* MAZE_SIZE / 10),MAZE_SIZE-1), 
}

let delay = 0;

let isMovingStart = false;
let isMovingGoal = false;
let isPathVisible = false;

// ******** Path finding engine Start *********

let MAZE = new Grid(MAZE_SIZE,START,GOAL)
let {path:dijkstraPath, allNeighbours:exploredPaths} = MAZE.dijkstra(START,GOAL)

// ******** Path finding engine End *********

// ******** Main Program Start *********


// renders the maze with specified dimensions
renderMaze("maze",MAZE_SIZE)

async function findPathAstar() {
    let {path, allNeighbours} = MAZE.Astar(START,GOAL);
    clearPath();
    clearExplored();
    await animateExploration(allNeighbours);
    if(!path || path.length === 0){
        alert("No path exists")
        return
    }
    if(path && path.length > 0)
        renderPath(path)
}

async function findPathDjikstra() {
    let {path, allNeighbours} = MAZE.dijkstra(START,GOAL);
    clearPath();
    clearExplored();
    await animateExploration(allNeighbours);
    if(!path || path.length === 0){
        alert("No path exists")
        return
    }
    if(path && path.length > 0)
        renderPath(path)
}

function renderPath(path, isAnimated=true) {
    renderPathHelper(path, isAnimated)
    isPathVisible=true;
}

async function animateExploration(explorations) {
    await animateExplorationHelper(explorations)
}

async function renderPathHelper(path, isAnimated) {
    for(let i=path.length-1;i>0;i--) {
        const temp = path[i]
        $(`#cell-${temp.y}-${temp.x}`).addClass("path");
        if(isAnimated)
            await timer(5)
    }
}
async function animateExplorationHelper(explorations) {
    for(let i =0; i < explorations.length; ++i) {
        for(let j = 0;j<explorations[i].length; ++j) {
            const cell = explorations[i][j]
            if((cell.x === GOAL.x) && (cell.y === GOAL.y)) return
            $(`#cell-${cell.y}-${cell.x}`).addClass("explored");
        }
        await timer(delay)
    }
}





// ******** Main Program End*********


// ******** Event Listeners Start *********

// clear the maze on clicking
$("#reset-btn").on("click", reset)
$("#clear-walls-btn").on("click", clearWalls)
$("#clear-path-btn").on("click", ()=>{clearPath();clearExplored()})
$("#visualize-btn").on("click", async function(){
    $(this).prop("disabled", true);
    const algo = $("#algo-dropdown-btn").text()
    switch(algo) {
        case "Djikstra":
            await findPathDjikstra();
            break;
        case "A*":
            await findPathAstar();
            break;
        default:
            alert("Please Select an algorithm");
    }
    $(this).prop("disabled", false);
})


// toggles the wall class on the hovered cell
$(".cell").on("mousedown", function(e){   
    e.preventDefault();
    e.stopPropagation(); 
    if($(this).hasClass("start")){
        isMovingStart = true;
    }
    if($(this).hasClass("goal")){
        isMovingGoal = true;
    }
    if(isPathVisible)
        clearPath();
})

$(document).on("mouseup", function(e){    
    isMovingStart = false;
    isMovingGoal = false;
})

$(".cell").on("mouseleave", function(e){
    if(isMovingStart && isInBounds(e)) {
        $(this).removeClass("start")
    }
    if(isMovingGoal && isInBounds(e)) {
        $(this).removeClass("goal")
    }
    if(isMovingGoal || isMovingStart)
        clearPath()
})

$(".cell").on("mouseenter", function(e){
    if(e.buttons == 1 || e.buttons == 3){
        const Xcor = parseInt($(this).attr("id").split("-")[2])
        const Ycor = parseInt($(this).attr("id").split("-")[1])
        if(!$(this).hasClass("start") && !$(this).hasClass("goal")){
            if(isInBounds(e)) {
                if(isMovingStart){
                    if(!$(this).hasClass("wall")){
                        START = {
                            x: Xcor,
                            y: Ycor
                        }
                        $(this).addClass("start")
                    }
                } else if(isMovingGoal){
                    if(!$(this).hasClass("wall")){
                        GOAL = {
                            x: Xcor,
                            y: Ycor
                        }
                        $(this).addClass("goal")
                    }
                } else {
                    if($(this).hasClass("wall")) {
                        $(this).removeClass("wall")
                        MAZE.grid[Ycor][Xcor].isWall = false;
                    } else {
                        $(this).addClass("wall")
                        MAZE.grid[Ycor][Xcor].isWall = true;
                    }
                }
            }
        }
        // if((isMovingGoal || isMovingStart))
        if((isPathVisible) && (isMovingGoal || isMovingStart))
            renderPath(MAZE.dijkstra(START, GOAL)["path"], false)
    }
});
$(".cell").on("click", function(e){
    e.preventDefault();
    e.stopPropagation();
    const Xcor = $(this).attr("id").split("-")[2]
    const Ycor = $(this).attr("id").split("-")[1]
    if(!$(this).hasClass("start") && !$(this).hasClass("goal")){
        if($(this).hasClass("wall")) {
            $(this).removeClass("wall")
            MAZE.grid[Ycor][Xcor].isWall = false;
        } else {
            $(this).addClass("wall")
            MAZE.grid[Ycor][Xcor].isWall = true;
        }
    }
});

$("#sortingSpeed").on("change", () => {
    speed = $("#sortingSpeed").attr("max") - $("#sortingSpeed").val();
    if (speed === 100) {
        $("#speedLabel").text("Slowest");
    } else if (speed < 100 && speed > 70) {
        $("#speedLabel").text("Slow");
    } else if (speed <= 70 && speed > 30) {
        $("#speedLabel").text("Medium");
    } else if (speed <= 30 && speed > 0) {
        $("#speedLabel").text("Fast");
    } else if (speed === 0) {
        $("#speedLabel").text("Fastest");
    }
    delay = speed;
});

$("#algo-dropdown a.dropdown-item").on("click",function(){
    const algo = $(this).attr("aria-label");
    $("#algo-dropdown-btn").text(algo)
    $("#visualize-btn").text("Visualize " + algo);
})


// ******** Event Listeners End *********


// ******** Helper Functions Start*********

// renders an nxn maze in the element with the given id
function renderMaze(contianerId, n) {
    maze = $(`#${contianerId}`)
    for(let i =0;i<n;++i) {
        maze.append(`<div id="row-${i}" class="maze-row"></div>`);
        row = $(`#row-${i}`)
        for(let j =0;j<n;++j) {
            if(j === START.x && i === START.y){
                row.append(`<div id="cell-${i}-${j}" class="start cell"></div>`);
            } else if(j === GOAL.x && i === GOAL.y) {
                row.append(`<div id="cell-${i}-${j}" class="goal cell"></div>`);
            } else {
                row.append(`<div id="cell-${i}-${j}" class="cell"></div>`);
            }
        }
    }
}


// resets the maze to inital settings
function reset() {
    clearWalls();
    clearPath();
    clearExplored();
    START = {
        x:Math.min(Math.floor(1* MAZE_SIZE / 10),MAZE_SIZE-1), 
        y:Math.min(Math.floor(1* MAZE_SIZE / 10),MAZE_SIZE-1), 
    }
    
    GOAL = {
        x:Math.min(Math.floor(8* MAZE_SIZE / 10),MAZE_SIZE-1), 
        y:Math.min(Math.floor(8* MAZE_SIZE / 10),MAZE_SIZE-1), 
    }
    

    $(".goal").removeClass("goal")
    $(".start").removeClass("start")

    $(`#cell-${START.y}-${START.x}`).addClass("start")
    $(`#cell-${GOAL.y}-${GOAL.x}`).addClass("goal")

}

// clears the wall from maze
function clearWalls() {
    clearHelper("wall")
    MAZE.clearWalls()
}

// clears the path from the maze
function clearPath() {
    clearHelper("path")
    isPathVisible = false;
    console.log(isPathVisible);
}
// clears the path from the maze
function clearExplored() {
    clearHelper("explored")
}

// removes the given class from all the cells
function clearHelper(className){
    for(let i =0;i<MAZE_SIZE;++i) {
        for(let j =0;j<MAZE_SIZE;++j) {
            $(`#cell-${i}-${j}`).removeClass(className)
        }
    }
}

// returns true if the curser is within the maze
function isInBounds(e) {
    const x = e.clientX 
    const y = e.clientY
    const width = $("#maze").width()
    const height = $("#maze").height()
    const left = $("#maze").position().left
    const top = $("#maze").position().top
    return (x >= left) && (y >= top) && (y < top + height) && (x < left + width)
}

// adds delay of given milliseconds
function timer(ms) {
    return new Promise(res => setTimeout(res, ms));
}

// ******** Helper Functions End *********