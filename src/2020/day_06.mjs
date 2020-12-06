import * as fs from 'node:fs';

class Person {
  constructor(data) {
    this.answers = data.split('');
  }
}

class Group {
  constructor(data) {
    this.persons = data.split('\n').map(line => new Person(line));
  }

  get uniqueAnswers() {
    return new Set(this.persons.flatMap(person => person.answers));
  }

  get numberOfUniqueAnswers() {
    return this.uniqueAnswers.size;
  }

  get numberOfSharedAnswers() {
    return [...this.uniqueAnswers].reduce((acc, cur) => acc + this.persons.every(({ answers }) => answers.includes(cur)), 0);
  }
}

const inputData = fs.readFileSync('input.txt', 'utf-8').trim().split('\n\n').map(data => new Group(data));

console.log(`Part 1: ${inputData.map(group => group.numberOfUniqueAnswers).reduce((acc, cur) => acc + cur, 0)}`);
console.log(`Part 2: ${inputData.map(group => group.numberOfSharedAnswers).reduce((acc, cur) => acc + cur, 0)}`);

