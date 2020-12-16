import * as fs from 'node:fs';

class Ticket {
  constructor(data) {
    this.fields = data.split(',').map(n => parseInt(n));
  }

  getInvalidFields(notes) {
    return this.fields.filter(num => !notes.allRules.some(([lower, upper]) => num >= lower && num <= upper));
  }

  getField(i) {
    return this.fields[i];
  }

  getFieldMap(notes) {
    return notes.fieldOrder.reduce((acc, fieldName, i) => ({ ...acc, [fieldName]: this.fields[i] }), {});
  }
}

class Notes {
  constructor(data) {
    data.split('\n').forEach(row => {
      let [fieldName, segments] = row.split(': ');
      segments = segments.split(' or ');
      this.fields[fieldName] = segments.map(rule => rule.split('-').map(n => parseInt(n)));
    });

    this.fieldOrder = this.findFieldOrder();
  }

  fields = {};

  get allRules() {
    return Object.values(this.fields).flat();
  }

  get fieldNames() {
    return Object.keys(this.fields);
  }

  findFieldOrder() {
    const allValidTickets = [myTicket, ...nearbyTickets.filter(ticket => !ticket.getInvalidFields(this).length)];
    const valuesByType = Array.from({ length: Object.keys(this.fields).length }, (_, i) => allValidTickets.map(ticket => ticket.getField(i)));
    const isValidGroup = (groupedValues, groupName) => groupedValues.every(value => (this.fields[groupName].some(([lower, upper]) => value >= lower && value <= upper)));

    const validityMap = [];
    for (let i = 0; i < this.fieldNames.length; i++) validityMap[i] = this.fieldNames.filter(field => isValidGroup(valuesByType[i], field));

    const pruned = new Set([]);

    while (true) {
      const groupWithSingleEntry = validityMap.find(group => group.length === 1 && !pruned.has(group[0]));
      if (!groupWithSingleEntry) break;
      const entry = groupWithSingleEntry[0];

      validityMap.forEach(group => {
        if (group === groupWithSingleEntry) return;
        const i = group.findIndex(field => field === entry);
        if (i >= 0) group.splice(i, 1);
      });

      pruned.add(entry);
    }

    return validityMap.flat();
  }
}

const [notesData, myTicketData, otherTicketsData] = fs.readFileSync('input.txt', 'utf-8').trim().split('\n\n').map(data => data);

const myTicket = new Ticket(myTicketData.split('\n')[1]);
const nearbyTickets = otherTicketsData.split('\n').slice(1).map(data => new Ticket(data));
const notes = new Notes(notesData);

const invalidValues = nearbyTickets.map(ticket => ticket.getInvalidFields(notes)).flat();
const ticketScanningErrorRate = invalidValues.reduce((acc, cur) => acc + cur, 0);
console.log(`Part 1: ${ticketScanningErrorRate}`);

const myDepartureInfo = Object.entries(myTicket.getFieldMap(notes)).filter(([name]) => name.startsWith('departure'));
console.log(`Part 2: ${myDepartureInfo.reduce((acc, [_, value]) => value * acc, 1)}`);
