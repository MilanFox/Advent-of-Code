import * as fs from 'node:fs';

class Graph {
  constructor(nodes) {
    this.buildLookupTable(nodes);
    this.linkChildNodes(nodes);
    this.mapMissingData(nodes);
  }

  nodes = {};

  buildLookupTable(nodes) {
    nodes.forEach(node => this.nodes[node.id] = node);
  }

  linkChildNodes(nodes) {
    nodes.forEach(node => {
      if (node.children) {
        node.children = node.children?.map(child => this.nodes[child]);
      } else {
        node.descendants = [];
        node.totalWeight = node.weight;
      }
    });
  }

  mapMissingData(nodes) {
    nodes.forEach(node => node.getAllDescendants());
    nodes.forEach(node => node.getTotalWeight());
  }

  get rootNode() {
    return Object.values(this.nodes).toSorted((a, b) => b.descendants.length - a.descendants.length).at(0);
  }

  get unbalancedNodes() {
    return Object.values(this.nodes).filter(node => node.isUnbalanced);
  }

  get unbalancedNode() {
    return this.unbalancedNodes.toSorted((a, b) => a.descendants.length - b.descendants.length).at(0);
  }

}

class Node {
  constructor(data) {
    const [info, children] = data.split(' -> ');
    let [id, weight] = info.split(' ');
    this.id = id;
    this.weight = parseInt(weight.substring(1, weight.length - 1));
    if (children) this.children = children.split(', ');
  }

  descendants = undefined;
  totalWeight = undefined;

  getAllDescendants() {
    if (this.descendants === undefined) this.descendants = [...this.children].concat(this.children.flatMap(child => child.getAllDescendants()));
    return this.descendants;
  }

  getTotalWeight() {
    if (this.totalWeight === undefined) this.totalWeight = this.weight + (this.children || []).reduce((acc, child) => acc + child.getTotalWeight(), 0);
    return this.totalWeight;
  }

  get isUnbalanced() {
    return new Set(this.children?.map(child => child.totalWeight)).size > 1;
  }

  get unbalancedChild() {
    const balance = this.children?.map(child => child.totalWeight);
    const targetWeight = balance.find(weight => balance.indexOf(weight) !== balance.lastIndexOf(weight));
    const wrongWeight = balance.find(weight => balance.indexOf(weight) === balance.lastIndexOf(weight));
    const node = this.children.find(node => node.totalWeight === wrongWeight);
    const difference = targetWeight - wrongWeight;

    return { difference, node };
  }
}

const graph = new Graph(fs.readFileSync('input.txt', 'utf-8').trim().split('\n').map(data => new Node(data)));

console.log(`Part 1: ${graph.rootNode.id}`);
console.log(`Part 2: ${graph.unbalancedNode.unbalancedChild.node.weight + graph.unbalancedNode.unbalancedChild.difference}`);
