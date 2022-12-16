import * as fs from 'node:fs';

class Valve {
  constructor(data) {
    const [valveData, neighborData] = data.split('; ');
    this.name = valveData.split(' ')[1];
    this.flowRate = parseInt(valveData.split('=')[1]);
    const tunnels = neighborData.split(' ').map(n => n.substring(0, 2)).slice(4);
    this.edges = tunnels.reduce((acc, cur) => ({ ...acc, [cur]: { weight: 1 } }), {});
  }

  get neighbors() {
    return Object.entries(this.edges).filter(([_, edge]) => edge.weight === 1);
  };
}

const valves = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(info => new Valve(info));

const addNodeByName = ([name, edge]) => { edge.node = valves.find(v => v.name === name); };

const identifyAllEdgeNodes = valve => { Object.entries(valve.edges).forEach(addNodeByName); };

const findShortestPath = (nameA, nameB) => {
  const startNode = valves.find(valve => valve.name === nameA);
  const queue = [{ node: startNode, length: 0 }];
  const visited = new Set([startNode.name]);

  while (queue.length > 0) {
    const { node, length } = queue.shift();

    for (const [neighbor, { weight, node: neighborNode }] of node.neighbors) {
      if (neighbor === nameB) return length + weight;
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({ node: neighborNode, length: length + weight });
      }
    }
  }

  return Number.MAX_VALUE;
};

const allValveNames = valves.map(valve => valve.name);

const addShortestPathToAllMissingNodes = () => {
  valves.forEach(valve => {
    allValveNames
      .filter(name => name !== valve.name && !Object.keys(valve.edges).includes(name))
      .forEach(neighbourName => {
        valve.edges[neighbourName] = { weight: findShortestPath(valve.name, neighbourName) };
        addNodeByName([neighbourName, valve.edges[neighbourName]]);
      });
  });
};

const zeroFlowRooms = allValveNames.filter(name => !valves.find(valve => valve.name === name).flowRate);

const deletePathsToZeroFlowRooms = () => {
  valves.forEach(valve => zeroFlowRooms.forEach(target => {
    delete valve.edges[target];
  }));
};

const findHighestReleasePotential = (graph, startNode) => {
  const numberOfValvesWithPositiveFlow = valves.length - zeroFlowRooms.length;
  const queue = [{ node: startNode, minutesRemaining: 30, opened: {} }];
  const quickestPathTo = {};
  let highestReleasePotential = 0;

  while (queue.length > 0) {
    let { node: currentNode, minutesRemaining, opened } = queue.shift();

    const logValue = () => {
      const possibleRelease = Object
        .values(opened)
        .reduce((acc, { minutesRemaining, flowRate }) => acc + flowRate * minutesRemaining, 0);
      highestReleasePotential = Math.max(highestReleasePotential, possibleRelease);
    };

    if (minutesRemaining === 0) {
      logValue();
      continue;
    }

    const hash = `${currentNode.name}-[${Object.entries(opened).toSorted().reduce((acc, [key, value]) => acc + `${key}:${value.minutesRemaining};`, '')}]`;
    if (quickestPathTo[hash] >= minutesRemaining) continue;

    quickestPathTo[hash] = minutesRemaining;
    const openedValve = {};

    if (currentNode.flowRate) {
      minutesRemaining -= 1;
      openedValve[currentNode.name] = { minutesRemaining, flowRate: currentNode.flowRate };
    }

    const namesOfOpenedValves = Object.keys(opened);

    if (namesOfOpenedValves.length + Object.keys(openedValve).length === numberOfValvesWithPositiveFlow) {
      opened = { ...opened, ...openedValve };
      logValue();
      continue;
    }

    Object.values(currentNode.edges).forEach(({ weight, node }) => {
      const potentialRemainingMinutes = minutesRemaining - weight;

      if (!namesOfOpenedValves.includes(node.name) && potentialRemainingMinutes >= 0) {
        queue.push({
          node, minutesRemaining: potentialRemainingMinutes, opened: { ...opened, ...openedValve },
        });
      }
    });
  }

  return highestReleasePotential;
};

const startNode = valves.find(valve => valve.name === 'AA');

valves.forEach(identifyAllEdgeNodes);
addShortestPathToAllMissingNodes();
deletePathsToZeroFlowRooms();

/* Unfinished: Currently giving the correct result for test data, but not real data... */
console.log(`Part 1: ${findHighestReleasePotential(valves, startNode)}`);
