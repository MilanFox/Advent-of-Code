export class Hash {
  constructor(inputString) {
    this.hashLength = 256;
    this.pointer = 0;
    this.skipSize = 0;
    this.sequence = Array.from({ length: this.hashLength }, (_, i) => ({ value: i, pos: i }));
    this.inputString = [...inputString];
    this.updateSequence();
    this.generateLengths();
  }

  updateSequence() {
    this.sequence = this.sequence.sort((a, b) => a.pos - b.pos);
  }

  pinchAndTwist(length) {
    for (let i = 0; i < length; i++) {
      const index = (this.pointer + i) % this.hashLength;
      const target = this.sequence[index];
      target.pos = ((this.pointer + (length - 1 - i)) + this.hashLength) % this.hashLength;
    }

    this.pointer = (this.pointer + (length + this.skipSize)) % this.hashLength;
    this.skipSize += 1;
    this.updateSequence();
  }

  hash({ cycles, lengths } = {}) {
    for (let i = 0; i < (cycles ?? 64); i++) (lengths ?? this.lengths).forEach(length => this.pinchAndTwist(length));
  }

  generateLengths() {
    this.lengths = this.inputString?.map(n => n.charCodeAt(0)).concat([17, 31, 73, 47, 23]);
  }

  get sparseHash() {
    return this.sequence.map(el => el.value);
  }

  get denseHash() {
    return Array.from({ length: 16 }, (_, i) =>
      this.sparseHash.slice(i * 16, (i + 1) * 16).reduce((acc, cur) => acc ^ cur, 0),
    );
  }

  get checksum() {
    return this.sequence[0].value * this.sequence[1].value;
  }

  get knotHash() {
    return this.denseHash.map(n => n.toString(16).padStart(2, '0')).join('');
  }
}
