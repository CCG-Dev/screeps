export default {
  run(creep) {
    if (creep.memory.working && creep.carry.energy == 0) {
      creep.memory.working = false;
    }
    if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
    }
    if (creep.room.memory.roles.haulerSpawning > 0 && creep.room.memory.creepCount.haulerSpawning == 0) {
      creep.memory.role = 'haulerSpawning';
    }

    if (creep.memory.working) {
      // Try finding map storage first
      var structure = creep.room.storage;
      /*
      var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => {
          return (s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < s.storeCapacity);
        }
      });
      */
      // If none found, then find Spawn, Extension, or Tower
      if (!structure) {
        structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (s) => {
            return ((s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity);
          }
        });
      }

      // Dropoff energy to found structure
      if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(structure, {
          visualizePathStyle: {
            stroke: '#ffaa00'
          }
        });
      }
    } else {
      // Find containers with energy over half capacity first
      var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => {
          return s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > s.storeCapacity / 2;
        }
      });
      if (!structure) {
        structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (s) => {
            return s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0;
          }
        });
      }
      if (structure) {
        if (creep.withdraw(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(structure, {
            visualizePathStyle: {
              stroke: '#ffffff'
            }
          });
        }
      } else {
        // Find dropped resources to pick up
        var target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        if (target) {
          if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
          }
        }
      }
    }
  }
};
