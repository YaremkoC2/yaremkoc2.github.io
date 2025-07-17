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
        // Draw gate body
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(this.x, this.y, 60, 40);
        ctx.strokeRect(this.x, this.y, 60, 40);

        // Configure font
        ctx.fillStyle = 'black';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw centered gate name
        ctx.fillText(this.constructor.name, this.x + 30, this.y + 20);

        // Draw inputs
        ctx.beginPath();
        ctx.arc(this.x, this.y + 10, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y + 30, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();

        // Draw outputs
        ctx.beginPath();
        ctx.arc(this.x + 60, this.y + 20, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
    }

    isInside(x, y) {
        return x >= this.x && x <= this.x + 60 && y >= this.y && y <= this.y + 40;
    }

    getOutputPosition() {
        return { x: this.x + 60, y: this.y + 20 };
    }

    getInputPosition(index) {
        if (index === 0) {
            return { x: this.x, y: this.y + 10 };
        } else if (index === 1) {
            return { x: this.x, y: this.y + 30 };
        }
        return null; // Invalid index
    }
}

class And extends Gate {
    getOutput() {
        const a = this.inA?.output ?? false;
        const b = this.inB?.output ?? false;
        return a && b;
    }
}

class Or extends Gate {
    getOutput() {
        const a = this.inA?.output ?? false;
        const b = this.inB?.output ?? false;
        return a || b;
    }
}

class Xor extends Gate {
    getOutput() {
        const a = this.inA?.output ?? false;
        const b = this.inB?.output ?? false;
        return a !== b;
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

class InputNode extends Gate {
    constructor(initial = false) {
        super(null, null);
        this.state = initial;
    }

    getOutput() {
        return this.state;
    }

    toggle() {
        this.state = !this.state;
        onLogicUpdate();
    }

    draw(ctx) {
        ctx.fillStyle = this.state ? '#b2f2bb' : '#ffa8a8'; // green/red
        ctx.fillRect(this.x, this.y, 60, 40);
        ctx.strokeRect(this.x, this.y, 60, 40);

        ctx.fillStyle = 'black';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.state ? '1' : '0', this.x + 30, this.y + 20);

        // draw output connection
        ctx.beginPath();
        ctx.arc(this.x + 60, this.y + 20, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
    }
}

class OutputNode extends Gate {
    constructor(input = null) {
        super(input, null);
    }

    getOutput() {
        return this.inA?.output ?? false;
    }

    draw(ctx) {
        const output = this.getOutput();

        // Fill the whole gate based on logic state
        ctx.fillStyle = output ? '#b2f2bb' : '#ffa8a8'; // green/red
        ctx.fillRect(this.x, this.y, 60, 40);
        ctx.strokeRect(this.x, this.y, 60, 40);

        // Draw the 1 or 0 label
        ctx.fillStyle = 'black';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(output ? '1' : '0', this.x + 30, this.y + 20);

        // Draw input connection 
        ctx.beginPath();
        ctx.arc(this.x, this.y + 20, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
    }
}

// Export everything
export { Gate, And, Or, Xor, NAnd, NOr, XNor, InputNode, OutputNode, nextGateId };
export let onLogicUpdate = () => {};
export function setLogicUpdateCallback(callback) {
    onLogicUpdate = callback;
}
