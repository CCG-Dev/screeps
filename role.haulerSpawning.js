module.exports = {
  run: function(creep) {
    if (creep.memory.working && creep.carry.energy == 0) {
      creep.memory.working = false;
    }
    if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
    }

    if (creep.memory.working) {
      var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => {
          return ((s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity);
        }
      });
      if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
          visualizePathStyle: {
            stroke: '#ffaa00'
          }
        });
      }
    } else {
      var target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
      if (target) {
        if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      } else {
        target = creep.room.storage;
        /*
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (s) => {
            return s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] >= (creep.carryCapacity - creep.carry.energy);
          }
        });
        */
        if (target) {
          if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {
              visualizePathStyle: {
                stroke: '#ffffff'
              }
            });
          }
        }
      }
    }
  }
};
