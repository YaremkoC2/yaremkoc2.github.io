let nextGateId = 0;

class Gate {
    constructor(inputA = null, inputB = null) {
        this.inA = inputA;
        this.inB = inputB;
        this.x = 0;
        this.y = 0;
        this.id = nextGateId++;
        this.connectedTo = [];
    }

    get output() {
        return this.getOutput();
    }

    getOutput() {
        throw new Error('getOutput() must be implemented');
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(this.x, this.y, 60, 40);
        ctx.strokeRect(this.x, this.y, 60, 40);
        ctx.fillStyle = 'black';
        ctx.fillText(this.constructor.name, this.x + 5, this.y + 25);
    }

    isInside(x, y) {
        return x >= this.x && x <= this.x + 60 && y >= this.y && y <= this.y + 40;
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

// Export everything
export { Gate, And, Or, Xor, NAnd, NOr, XNor };
