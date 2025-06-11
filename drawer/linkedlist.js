// Simple linked list implementation in JavaScript
class LinkedListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.count = 0;
    }

    get First() {
        return this.head;
    }

    addLast(value) {
        const newNode = new LinkedListNode(value);
        if (!this.head) {
            this.head = newNode;
        } else {
            let node = this.head;
            while (node.next) {
                node = node.next;
            }
            node.next = newNode;
        }
        this.count++;
    }

    remove(nodeToRemove) {
        if (!this.head) return;

        if (this.head === nodeToRemove) {
            this.head = this.head.next;
            this.count--;
            return;
        }

        let prev = this.head;
        while (prev.next && prev.next !== nodeToRemove) {
            prev = prev.next;
        }

        if (prev.next === nodeToRemove) {
            prev.next = nodeToRemove.next;
            this.count--;
        }
    }

    removeLast() {
        if (!this.head) return;

        if (this.head.next === null) {
            this.head = null;
            this.count--;
            return;
        }

        let node = this.head;
        while (node.next && node.next.next) {
            node = node.next;
        }

        node.next = null;
        this.count--;
    }

    get Count() {
        return this.count;
    }
}

export { LinkedList, LinkedListNode };
