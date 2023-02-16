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
        
        // const visited = Array.from({ length: this.size }, () => 
        //                         Array.from({ length: this.size }, () => false));

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
            const neighbours = getNeighbours(this, curr)
            neighbours.forEach(neighbour => {
                const dist = distances[curr.y][curr.x] + 1;
                if(isGood(neighbour, dist)) {
                    distances[neighbour.y][neighbour.x] = dist
                    predecessor[neighbour.y][neighbour.x] = curr
                    remaining.enqueue(neighbour, dist)
                    if((neighbour.x === GOAL.x) && (neighbour.y === GOAL.y)) {
                        return
                    }
                    allNeighbours.push([...remaining.heap.map(elem=>elem.item)])
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


        function getNeighbours(self, curr) {
            const j = curr.x
            const i = curr.y
            const neighbours = []
            if(i-1 >=0){
                neighbours.push(self.grid[i-1][j])
                if(allowDiagonals && (j+1 < self.size)) {
                    neighbours.push(self.grid[i-1][j+1])
                }
            }
            if(j+1 < self.size){
                neighbours.push(self.grid[i][j+1])
                if(allowDiagonals && (i+1 < self.size)) {
                    neighbours.push(self.grid[i+1][j+1])
                }
            }
            if(i+1 < self.size){
                neighbours.push(self.grid[i+1][j])
                if(allowDiagonals && (j-1 >= 0)) {
                    neighbours.push(self.grid[i+1][j-1])
                }
            }
            if(j-1 >=0){
                neighbours.push(self.grid[i][j-1])
                if(allowDiagonals && (i-1 >= 0)) {
                    neighbours.push(self.grid[i-1][j-1])
                }
            }
            return neighbours;
        }

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
            const neighbours = getNeighbours(this, curr)
            neighbours.forEach(neighbour => {
                const dist = distances[curr.y][curr.x] + 1;
                heuristics[neighbour.y][neighbour.x] = calcHeuristic(neighbour)
                if(isGood(neighbour, dist)) {
                    distances[neighbour.y][neighbour.x] = dist
                    predecessor[neighbour.y][neighbour.x] = curr
                    remaining.enqueue(neighbour, (dist+heuristics[neighbour.y][neighbour.x]))
                    if((neighbour.x === GOAL.x) && (neighbour.y === GOAL.y)) {
                        return
                    }
                    allNeighbours.push([...remaining.heap.map(elem=>elem.item)])
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


        function getNeighbours(self, curr) {
            const j = curr.x
            const i = curr.y
            const neighbours = []
            if(i-1 >=0){
                neighbours.push(self.grid[i-1][j])
                if(allowDiagonals && (j+1 < self.size)) {
                    neighbours.push(self.grid[i-1][j+1])
                }
            }
            if(j+1 < self.size){
                neighbours.push(self.grid[i][j+1])
                if(allowDiagonals && (i+1 < self.size)) {
                    neighbours.push(self.grid[i+1][j+1])
                }
            }
            if(i+1 < self.size){
                neighbours.push(self.grid[i+1][j])
                if(allowDiagonals && (j-1 >= 0)) {
                    neighbours.push(self.grid[i+1][j-1])
                }
            }
            if(j-1 >=0){
                neighbours.push(self.grid[i][j-1])
                if(allowDiagonals && (i-1 >= 0)) {
                    neighbours.push(self.grid[i-1][j-1])
                }
            }
            return neighbours;
        }

        function isGood(neighbour,newDist) {
            return !neighbour.isWall && (distances[neighbour.y][neighbour.x] > newDist)
        }

        function calcHeuristic(node) {
            const deltaX = Math.abs(end.x - node.x)
            const deltaY = Math.abs(end.y - node.y)
            return deltaX + deltaY
        }

    }
}