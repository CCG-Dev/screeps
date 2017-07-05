var roleBuilder = require('role.builder');

module.exports = {
  run: function(creep) {
    if (creep.memory.working == true && creep.carry.energy == 0) {
      creep.memory.working = false;
    } else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
    }

    if (creep.memory.working == true) {
      var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
      });

      if (structure != undefined) {
        if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
          creep.moveTo(structure);
        }
      } else {
        roleBuilder.run(creep);
      }
    } else {
      creep.getEnergy(true, true);
      /*
      var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => {
          return (s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0)
        }
      });
      if (!target) {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > structure.storeCapacity / 2) || ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_TOWER) && structure.energy > structure.energyCapacity / 2);
          }
        });
      }
      if (target) {
        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {
            visualizePathStyle: {
              stroke: '#ffaa00'
            }
          });
        }
      } else {
        var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
      }
      */
    }
  }
};
