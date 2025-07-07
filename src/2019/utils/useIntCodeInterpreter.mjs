export class IntCodeComputer {
  constructor(memory, { input } = {}) {
    this.#memory = [...memory];
    this.#pointer = 0;
    this.#inputQueue = [];
    this.#outputQueue = [];
    this.#halted = false;
    this.pauseOnOutput = false;
    this.#relativeBase = 0;

    if (input !== undefined) this.#inputQueue = [...input];
  }

  #memory;
  #pointer;
  #inputQueue;
  #outputQueue;
  #shouldPause = false;
  #halted;
  #relativeBase;

  /**
   * UTILS
   */

  #movePointer(index) {
    this.#pointer += index;
  }

  #getValue(value, mode) {
    if (mode === 2) return this.#memory[value + this.#relativeBase] ?? 0;
    if (mode === 1) return value;
    if (mode === 0) return this.#memory[value] ?? 0;
    throw new Error('Illegal Parameter Mode');
  }

  get #currentInstruction() {
    return this.#memory[this.#pointer] % 100;
  }

  #getCurrentParamModes(n) {
    return this.#memory[this.#pointer].toString().slice(0, -2).padStart(n, '0').split('').reverse().map(n => parseInt(n));
  }

  #getParams(n) {
    const paramModes = this.#getCurrentParamModes(n);
    return this.#memory.slice(this.#pointer + 1, this.#pointer + 1 + n).map((val, i) => this.#getValue(val, paramModes[i]));
  }

  #getWriteAddress(offset, mode) {
    const param = this.#memory[this.#pointer + offset];
    if (mode === 2) return param + this.#relativeBase;
    if (mode === 0) return param;
    throw new Error('Illegal Parameter Mode for write');
  }

  /**
   * EVENTS
   */

  EVENT_NAMES = Object.freeze({
    AFTER_OUTPUT: 'afterOutput',
    AFTER_PAUSE: 'afterPause',
    AFTER_HALT: 'afterHalt',
    NEEDS_INPUT: 'needsInput',
  });

  #events = {};

  on(eventName, cb) {
    (this.#events[eventName] ??= []).push(cb);
  };

  #emit(eventName, payload) {
    this.#events[eventName]?.forEach(f => f(payload));
  };

  /**
   * BREAKPOINTS
   */

  pause() {
    this.#shouldPause = true;
  }

  get isHalted() {
    return this.#halted;
  }

  /**
   * FUNCTIONS
   */

  #callFunction = [
    null,
    this.#add.bind(this),
    this.#multiply.bind(this),
    this.#input.bind(this),
    this.#output.bind(this),
    this.#jumpIfTrue.bind(this),
    this.#jumpIfFalse.bind(this),
    this.#lessThan.bind(this),
    this.#equals.bind(this),
    this.#adjustRelativeBase.bind(this),
  ];

  #add() {
    const numberOfParams = 2;
    const [addend1, addend2] = this.#getParams(numberOfParams);
    const paramModes = this.#getCurrentParamModes(numberOfParams + 1);
    const targetAddress = this.#getWriteAddress(numberOfParams + 1, paramModes[numberOfParams]);
    this.#memory[targetAddress] = addend1 + addend2;
    this.#movePointer(numberOfParams + 2);
  }

  #multiply() {
    const numberOfParams = 2;
    const [multiplicant, multiplier] = this.#getParams(numberOfParams);
    const paramModes = this.#getCurrentParamModes(numberOfParams + 1);
    const targetAddress = this.#getWriteAddress(numberOfParams + 1, paramModes[numberOfParams]);
    this.#memory[targetAddress] = multiplicant * multiplier;
    this.#movePointer(numberOfParams + 2);
  }

  async #input() {
    const numberOfParams = 0;
    const paramModes = this.#getCurrentParamModes(numberOfParams + 1);
    const targetAddress = this.#getWriteAddress(numberOfParams + 1, paramModes[numberOfParams]);
    if (!this.#inputQueue.length) {
      this.#shouldPause = true;
      this.#emit(this.EVENT_NAMES.NEEDS_INPUT);
    } else {
      this.#memory[targetAddress] = this.#inputQueue.shift();
      this.#movePointer(2);
    }
  }

  #output() {
    const [outputValue] = this.#getParams(1);
    this.#outputQueue.push(outputValue);
    this.#movePointer(2);
    this.#emit(this.EVENT_NAMES.AFTER_OUTPUT);
    if (this.pauseOnOutput) this.pause();
  }

  #jumpIfTrue() {
    const [checkValue, jumpTarget] = this.#getParams(2);
    if (checkValue !== 0) this.#pointer = jumpTarget; else this.#movePointer(3);
  }

  #jumpIfFalse() {
    const [checkValue, jumpTarget] = this.#getParams(2);
    if (checkValue === 0) this.#pointer = jumpTarget; else this.#movePointer(3);
  }

  #lessThan() {
    const numberOfParams = 2;
    const [param1, param2] = this.#getParams(numberOfParams);
    const paramModes = this.#getCurrentParamModes(numberOfParams + 1);
    const targetAddress = this.#getWriteAddress(numberOfParams + 1, paramModes[numberOfParams]);
    if (param1 < param2) this.#memory[targetAddress] = 1; else this.#memory[targetAddress] = 0;
    this.#movePointer(4);
  }

  #equals() {
    const numberOfParams = 2;
    const [param1, param2] = this.#getParams(numberOfParams);
    const paramModes = this.#getCurrentParamModes(numberOfParams + 1);
    const targetAddress = this.#getWriteAddress(numberOfParams + 1, paramModes[numberOfParams]);
    if (param1 === param2) this.#memory[targetAddress] = 1; else this.#memory[targetAddress] = 0;
    this.#movePointer(4);
  }

  #adjustRelativeBase() {
    const [param] = this.#getParams(1);
    this.#relativeBase += param;
    this.#movePointer(2);
  }

  /**
   * PUBLIC
   */

  get memory() {
    return this.#memory;
  }

  get outputQueue() {
    return this.#outputQueue;
  }

  get lastOutput() {
    return this.#outputQueue.at(-1);
  }

  queueInput(n) {
    this.#inputQueue.push(n);
  }

  async run() {
    this.#shouldPause = false;

    while (true) {
      if (this.#shouldPause) break;
      const opCode = this.#currentInstruction;
      if (opCode === 99) {
        this.#halted = true;
        break;
      }
      await this.#callFunction[opCode]();
    }

    this.#emit(this.#shouldPause ? this.EVENT_NAMES.AFTER_PAUSE : this.EVENT_NAMES.AFTER_HALT);
  }
}
