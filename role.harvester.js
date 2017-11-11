import common from './common';
// const common = require('common');

var roleHarvester = {
  assignSource = creep => {
    var flags = _.filter(creep.room.find(FIND_FLAGS), (flag) => flag.name.substring(0, 1) === "S" && flag.name !== "Storage");
    var roomName = creep.room.name;
    var maxHarvesters = 0;
    for (var fName in flags) {
      var f = flags[fName];
      var gID = creep.room.lookForAt(LOOK_SOURCES, f)[0].id;
      var numberToHarvest = parseInt(f.name.substring(1));
      maxHarvesters = maxHarvesters + numberToHarvest;
      for (var cName in Game.creeps) {
        var c = Game.creeps[cName];
        if (c.memory.source === gID) {
          numberToHarvest = numberToHarvest - 1;
        }
      }
      if (numberToHarvest > 0 && creep.memory.source === "") {
        creep.memory.source = gID;
      }
    }
    Memory.rooms[roomName].roles.harvester = maxHarvesters;
  };
  run = creep => {
    console.log(common.getEnergy(creep));
    if (creep.memory.target == undefined) {
      creep.memory.target = creep.room.name;
    }
    else if (creep.memory.target != undefined && creep.room.name != creep.memory.target) {
      var exit = creep.room.findExitTo(creep.memory.target);
      creep.moveTo(creep.pos.findClosestByRange(exit));
      return;
    }
    // Initialize creep memory with source if doesn't exist
    if (creep.memory.source == undefined) {
      creep.memory.source = '';
    }
    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
      creep.say('⤵ dropoff');
    }
    if (creep.memory.working == true) {
      var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => {
          return (s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity) || ((s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity) || (s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < s.storeCapacity);
        }
      });
      if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(structure, {
          visualizePathStyle: {
            stroke: '#ffaa00'
          }
        });
      }
    } else {
      //creep.getEnergy(false, true);
        var sourceID = creep.memory.source;
        if (sourceID) {
          var source = Game.getObjectById(sourceID);
          if (creep.harvest(source) == ERR_NOT_IN_RANGE || creep.harvest(source) == ERR_NOT_ENOUGH_RESOURCES) {
            creep.moveTo(source, {
              visualizePathStyle: {
                stroke: '#ffffff'
              }
            });
          }
        } else {
          this.assignSource(creep);
        }
    }
    /*
    if (!creep.memory.working) {
      var sourceID = creep.memory.source;
      if (sourceID) {
        var source = Game.getObjectById(sourceID);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source, {
            visualizePathStyle: {
              stroke: '#ffffff'
            }
          });
        }
      } else {
        this.assignSource(creep);
      }
    } else {
      var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => {
          return (s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity) || ((s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity) || (s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < s.storeCapacity);
        }
      });
      if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
          visualizePathStyle: {
            stroke: '#ffaa00'
          }
        });
      }
    }
    */
  };
};

module.exports = roleHarvester;
