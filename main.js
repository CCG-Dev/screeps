require('prototype.spawner')();
require('prototype.tower');
require('prototype.creep');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleHaulerMining = require('role.haulerMining');
var roleHaulerSpawning = require('role.haulerSpawning');
var roleClaimer = require('role.claimer');
var roleLongDistanceHarvester = require('role.longDistanceHarvester');
var structureSpawn = require('structure.spawn');

global.HOME = 'W7N4';

module.exports.loop = function() {
  for (let name in Memory.creeps) {
    if (Game.creeps[name] == undefined) {
      delete Memory.creeps[name];
    }
  }

  for (let name in Game.creeps) {
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

  var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
  for (let tower of towers) {
    tower.defend();
  }

  for (let spawnName in Game.spawns) {
    let spawn = Game.spawns[spawnName];

    structureSpawn.run(spawn);
  }
}
