require('prototype.spawner')();
require('prototype.tower');
require('prototype.creep');
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const roleHaulerMining = require('role.haulerMining');
const roleHaulerSpawning = require('role.haulerSpawning');
const roleClaimer = require('role.claimer');
const roleLongDistanceHarvester = require('role.longDistanceHarvester');
const structureSpawn = require('structure.spawn');

global.HOME = 'W7N4';

module.exports.loop = () => {
  for (const name in Memory.creeps) {
    if (Game.creeps[name] === undefined) {
      delete Memory.creeps[name];
    }
  }

  for (const name in Game.creeps) {
    var creep = Game.creeps[name];
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

  const towers = _.filter(Game.structures, s => s.structureType === STRUCTURE_TOWER);
  for (const tower of towers) {
    tower.defend();
  }

  for (const spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName];
    structureSpawn.run(spawn);
  }
}
