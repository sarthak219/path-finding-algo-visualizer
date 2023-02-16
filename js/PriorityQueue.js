class PriorityQueue {
    constructor() {
      this.heap = [];
    }
  
    enqueue(item, priority) {
      const newNode = { item, priority };
      this.heap.push(newNode);
      this.siftUp(this.heap.length - 1);
    }
  
    dequeue() {
      if (this.isEmpty()) {
        return null;
      }
  
      if (this.heap.length === 1) {
        return this.heap.pop().item;
      }
  
      const top = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.siftDown(0);
      return top.item;
    }
  
    isEmpty() {
      return this.heap.length === 0;
    }
  
    siftUp(index) {
      let parent = Math.floor((index - 1) / 2);
  
      while (index > 0 && this.heap[parent].priority > this.heap[index].priority) {
        [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
        index = parent;
        parent = Math.floor((index - 1) / 2);
      }
    }
  
    siftDown(index) {
      let minIndex = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;
  
      if (left < this.heap.length && this.heap[left].priority < this.heap[minIndex].priority) {
        minIndex = left;
      }
  
      if (right < this.heap.length && this.heap[right].priority < this.heap[minIndex].priority) {
        minIndex = right;
      }
  
      if (index !== minIndex) {
        [this.heap[index], this.heap[minIndex]] = [this.heap[minIndex], this.heap[index]];
        this.siftDown(minIndex);
      }
    }
  }