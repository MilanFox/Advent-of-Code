import * as fs from 'node:fs';

const RESOURCES = { ore: 'ore', clay: 'clay', obsidian: 'obsidian' };

class Robot {
  cost = {};
  count = 0;
}

class RobotBlueprint {
  constructor(data) {
    [this.id, this.oreRobot.cost[RESOURCES.ore], this.clayRobot.cost[RESOURCES.ore], this.obsidianRobot.cost[RESOURCES.ore], this.obsidianRobot.cost[RESOURCES.clay], this.geodeRobot.cost[RESOURCES.ore], this.geodeRobot.cost[RESOURCES.obsidian]] = data.match(/\d+/g).map(Number);
  }

  availableRessources = Object.keys(RESOURCES).reduce((acc, cur) => ({ ...acc, [cur]: 0 }), {});

  oreRobot = new Robot();
  clayRobot = new Robot();
  obsidianRobot = new Robot();
  geodeRobot = new Robot();
}

const robots = fs
  .readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(data => new RobotBlueprint(data));

/* Unfinished*/
