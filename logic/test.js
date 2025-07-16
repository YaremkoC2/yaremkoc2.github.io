// import logic gates
import { And, Or, Xor, NAnd, NOr, XNor } from './gates.js';

function runLogicGateTests() {
    const tests = [
        { gate: new And(true, true), expected: true },
        { gate: new And(true, false), expected: false },
        { gate: new Or(false, false), expected: false },
        { gate: new Or(true, false), expected: true },
        { gate: new Xor(true, false), expected: true },
        { gate: new Xor(true, true), expected: false },
        { gate: new NAnd(true, true), expected: false },
        { gate: new NOr(false, false), expected: true },
        { gate: new XNor(false, false), expected: true },
        { gate: new XNor(true, false), expected: false },
    ];

    tests.forEach(({ gate, expected }, i) => {
        const result = gate.output;
        console.log(`${i + 1}: ${gate.constructor.name}(${gate.inA}, ${gate.inB}) → ${result} [${result === expected ? 'PASS' : 'FAIL'}]`);
    });
}

runLogicGateTests();
