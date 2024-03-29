class Cell {
    constructor(x,y,elem=null) {
        this.key = String(y + "-"+ x)
        this.x = x
        this.y = y
        this.elem = elem
        this.isWall = false
    }
}

class Grid {
    grid = []
    constructor(n) {
        this.size = n
        for(let i = 0; i < n; i++) {
            const temp = []
            for(let j =0; j < n; j++) {
                temp.push(new Cell(j,i))
            }
            this.grid.push(temp)
        }
    }

    clearWalls() {
        for(let i=0;i<this.size;++i) {
            for(let j=0;j<this.size;++j) {
                this.grid[i][j].isWall = false;
            }
        }
    }

    dijkstra(start,end, allowDiagonals=false) {
        const startX = start.x
        const startY = start.y

        const distances = Array.from({ length: this.size }, () => 
                                Array.from({ length: this.size }, () => Infinity));
        distances[startY][startX] = 0;

        const predecessor = Array.from({ length: this.size }, () => 
                                Array.from({ length: this.size }, () => null));

        const remaining = new PriorityQueue()
        remaining.enqueue(this.grid[startY][startX], 0)
        
        const allNeighbours = []
        while(!remaining.isEmpty()) {
            let curr = remaining.dequeue()
            const neighbours = this.getNeighbours(curr, allowDiagonals)
            neighbours.forEach(neighbour => {
                const dist = distances[curr.y][curr.x] + 1;
                if(isGood(neighbour, dist)) {
                    distances[neighbour.y][neighbour.x] = dist
                    predecessor[neighbour.y][neighbour.x] = curr
                    remaining.enqueue(neighbour, dist)
                    allNeighbours.push([...remaining.heap.map(elem=>elem.item)])
                    if((neighbour.x === GOAL.x) && (neighbour.y === GOAL.y)) {
                        return
                    }
                }
            });
        }

        let curr = end
        if(!predecessor[curr.y][curr.x]) return {path:[], allNeighbours}
        const path = []
        while((curr.x != startX) || (curr.y != startY)) {
            path.push(this.grid[curr.y][curr.x])
            curr = predecessor[curr.y][curr.x]
        }

        return {path, allNeighbours};

        function isGood(neighbour,newDist) {
            return !neighbour.isWall && (distances[neighbour.y][neighbour.x] > newDist)
        }

    }

    Astar(start,end, allowDiagonals=false) {
        const startX = start.x
        const startY = start.y

        const distances = Array.from({ length: this.size }, () => 
                                Array.from({ length: this.size }, () => Infinity));
        distances[startY][startX] = 0;

        const heuristics = Array.from({ length: this.size }, () => 
                                Array.from({ length: this.size }, () => Infinity));

        const predecessor = Array.from({ length: this.size }, () => 
                                Array.from({ length: this.size }, () => null));

        const remaining = new PriorityQueue()
        remaining.enqueue(this.grid[startY][startX], 0)
        
        const allNeighbours = []
        while(!remaining.isEmpty()) {
            let curr = remaining.dequeue()
            const neighbours = this.getNeighbours(curr, allowDiagonals)
            neighbours.forEach(neighbour => {
                const dist = distances[curr.y][curr.x] + 1;
                heuristics[neighbour.y][neighbour.x] = calcHeuristic(neighbour)
                if(isGood(neighbour, dist)) {
                    distances[neighbour.y][neighbour.x] = dist
                    predecessor[neighbour.y][neighbour.x] = curr
                    remaining.enqueue(neighbour, (dist+heuristics[neighbour.y][neighbour.x]))
                    allNeighbours.push([...remaining.heap.map(elem=>elem.item)])
                    if((neighbour.x === GOAL.x) && (neighbour.y === GOAL.y)) {
                        return
                    }
                }
            });
        }

        let curr = end
        if(!predecessor[curr.y][curr.x]) return {path:[], allNeighbours}
        const path = []
        while((curr.x != startX) || (curr.y != startY)) {
            path.push(this.grid[curr.y][curr.x])
            curr = predecessor[curr.y][curr.x]
        }

        return {path, allNeighbours};

        function isGood(neighbour,newDist) {
            return !neighbour.isWall && (distances[neighbour.y][neighbour.x] > newDist)
        }

        function calcHeuristic(node) {
            const deltaX = Math.abs(end.x - node.x)
            const deltaY = Math.abs(end.y - node.y)
            return deltaX + deltaY
        }

    }

    bestFS(start,end, allowDiagonals=false) {
        const startX = start.x
        const startY = start.y

        const visited = Array.from({ length: this.size }, () => 
                        Array.from({ length: this.size }, () => false));

        const heuristics = Array.from({ length: this.size }, () => 
                                Array.from({ length: this.size }, () => Infinity));

        const predecessor = Array.from({ length: this.size }, () => 
                                Array.from({ length: this.size }, () => null));

        const remaining = new PriorityQueue()
        remaining.enqueue(this.grid[startY][startX], calcHeuristic(this.grid[startY][startX]))
        
        const allNeighbours = []
        while(!remaining.isEmpty()) {
            let curr = remaining.dequeue()
            const neighbours = this.getNeighbours(curr, allowDiagonals)
            neighbours.forEach(neighbour => {
                heuristics[neighbour.y][neighbour.x] = calcHeuristic(neighbour)
                console.log(heuristics[neighbour.y][neighbour.x]);
                if(isGood(neighbour)) {
                    visited[neighbour.y][neighbour.x] = true
                    predecessor[neighbour.y][neighbour.x] = curr
                    remaining.enqueue(neighbour, heuristics[neighbour.y][neighbour.x])
                    allNeighbours.push([...remaining.heap.map(elem=>elem.item)])
                    if((neighbour.x === GOAL.x) && (neighbour.y === GOAL.y)) {
                        remaining.emptyQueue()
                        return
                    }
                }
            });
        }

        let curr = end
        if(!predecessor[curr.y][curr.x]) return {path:[], allNeighbours}
        const path = []
        while((curr.x != startX) || (curr.y != startY)) {
            path.push(this.grid[curr.y][curr.x])
            curr = predecessor[curr.y][curr.x]
        }

        return {path, allNeighbours};

        function isGood(neighbour) {
            return !neighbour.isWall && !visited[neighbour.y][neighbour.x];
        }

        function calcHeuristic(node) {
            const deltaX = Math.abs(end.x - node.x)
            const deltaY = Math.abs(end.y - node.y)
            return deltaX + deltaY
        }

    }

    bfs(start,end, allowDiagonals=false) {
        const startX = start.x
        const startY = start.y

        const distances = Array.from({ length: this.size }, () => 
                                Array.from({ length: this.size }, () => Infinity));
        distances[startY][startX] = 0;

        const predecessor = Array.from({ length: this.size }, () => 
                                Array.from({ length: this.size }, () => null));

        const remaining = new Queue()
        remaining.enqueue(this.grid[startY][startX], 0)
        
        const allNeighbours = []
        while(!remaining.isEmpty()) {
            let curr = remaining.dequeue()
            const neighbours = this.getNeighbours(curr, allowDiagonals)
            neighbours.forEach(neighbour => {
                const dist = distances[curr.y][curr.x] + 1;
                if(isGood(neighbour, dist)) {
                    distances[neighbour.y][neighbour.x] = dist
                    predecessor[neighbour.y][neighbour.x] = curr
                    remaining.enqueue(neighbour, dist)
                    allNeighbours.push([...remaining.items])
                    if((neighbour.x === GOAL.x) && (neighbour.y === GOAL.y)) {
                        return
                    }
                }
            });
        }

        let curr = end
        if(!predecessor[curr.y][curr.x]) return {path:[], allNeighbours}
        const path = []
        while((curr.x != startX) || (curr.y != startY)) {
            path.push(this.grid[curr.y][curr.x])
            curr = predecessor[curr.y][curr.x]
        }

        return {path, allNeighbours};

        function isGood(neighbour,newDist) {
            return !neighbour.isWall && (distances[neighbour.y][neighbour.x] > newDist)
        }

    }
    
    dfs(start,end, allowDiagonals=false) {
        const startX = start.x
        const startY = start.y
        
        const visited = Array.from({ length: this.size }, () => 
                                Array.from({ length: this.size }, () => false));

        const predecessor = Array.from({ length: this.size }, () => 
                                Array.from({ length: this.size }, () => null));

        const remaining = new Stack()
        remaining.push(this.grid[startY][startX], 0)
        
        const allNeighbours = []
        while(!remaining.isEmpty()) {
            let curr = remaining.pop()
            const neighbours = this.getNeighbours(curr, allowDiagonals)
            neighbours.forEach(neighbour => {
                if(isGood(neighbour)) {
                    visited[neighbour.y][neighbour.x] = true
                    predecessor[neighbour.y][neighbour.x] = curr
                    remaining.push(neighbour)
                    allNeighbours.push([...remaining.items])
                    if((neighbour.x === GOAL.x) && (neighbour.y === GOAL.y)) {
                        return
                    }
                }
            });
        }

        let curr = end
        if(!predecessor[curr.y][curr.x]) return {path:[], allNeighbours}
        const path = []
        while((curr.x != startX) || (curr.y != startY)) {
            path.push(this.grid[curr.y][curr.x])
            curr = predecessor[curr.y][curr.x]
        }

        return {path, allNeighbours};

        function isGood(neighbour) {
            return !neighbour.isWall && (!visited[neighbour.y][neighbour.x])
        }

    }

    // Returns the neighbouring nodes of the given node "curr".
    getNeighbours(curr, allowDiagonals=false) {
        const j = curr.x
        const i = curr.y
        const neighbours = []
        if(i-1 >=0){
            neighbours.push(this.grid[i-1][j])
            if(allowDiagonals && (j+1 < this.size)) {
                neighbours.push(this.grid[i-1][j+1])
            }
        }
        if(j+1 < this.size){
            neighbours.push(this.grid[i][j+1])
            if(allowDiagonals && (i+1 < this.size)) {
                neighbours.push(this.grid[i+1][j+1])
            }
        }
        if(i+1 < this.size){
            neighbours.push(this.grid[i+1][j])
            if(allowDiagonals && (j-1 >= 0)) {
                neighbours.push(this.grid[i+1][j-1])
            }
        }
        if(j-1 >=0){
            neighbours.push(this.grid[i][j-1])
            if(allowDiagonals && (i-1 >= 0)) {
                neighbours.push(this.grid[i-1][j-1])
            }
        }
        return neighbours;
    }
}