require('prototype.spawner')();
require('prototype.tower');
require('prototype.creep');
require('prototype.source');
import roleHarvester from 'role.harvester';
import roleUpgrader from 'role.upgrader';
import roleBuilder from 'role.builder';
import roleRepairer from 'role.repairer';
import roleHaulerMining from 'role.haulerMining';
import roleHaulerSpawning from 'role.haulerSpawning';
import roleClaimer from 'role.claimer';
import roleLongDistanceHarvester from 'role.longDistanceHarvester';
import structureSpawn from 'structure.spawn';

global.HOME = 'W7N4';

export function loop() {
  for (const name in Memory.creeps) {
    if (Game.creeps[name] == undefined) {
      delete Memory.creeps[name];
    }
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role == 'harvester') {
      roleHarvester.run(creep);
    } else if (creep.memory.role == 'haulerMining') {
      roleHaulerMining.run(creep);
    } else if (creep.memory.role == 'haulerSpawning') {
      roleHaulerSpawning.run(creep);
    } else if (creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep);
    } else if (creep.memory.role == 'builder') {
      roleBuilder.run(creep);
    } else if (creep.memory.role == 'repairer') {
      roleRepairer.run(creep);
    } else if (creep.memory.role == 'claimer') {
      roleClaimer.run(creep);
    } else if (creep.memory.role == 'longDistanceHarvester') {
      roleLongDistanceHarvester.run(creep);
    } else {
      creep.memory.role = 'builder';
    }
  }

  const towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
  for (const tower of towers) {
    tower.defend();
  }

  for (const spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName];
    structureSpawn.run(spawn);
  }
}
