class Gate {
    constructor(inputA, inputB) {
        this.inA = inputA;
        this.inB = inputB;
    }

    // Getter for output, calls derived class implementation
    get output() {
        return this.getOutput();
    }

    // Abstract method - should be overridden
    getOutput() {
        throw new Error('getOutput() must be implemented by subclass');
    }
}

class And extends Gate {
    getOutput() {
        return this.inA && this.inB;
    }
}

class Or extends Gate {
    getOutput() {
        return this.inA || this.inB;
    }
}

class Xor extends Gate {
    getOutput() {
        return this.inA !== this.inB;
    }
}

class NAnd extends And {
    getOutput() {
        return !super.getOutput();
    }
}

class NOr extends Or {
    getOutput() {
        return !super.getOutput();
    }
}

class XNor extends Xor {
    getOutput() {
        return !super.getOutput();
    }
}
