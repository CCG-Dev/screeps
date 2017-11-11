import roleUpgrader from 'role.upgrader';

export default {
  run(creep) {
    if (creep.memory.target == undefined) {
      creep.memory.target = creep.room.name;
    }
    else if (creep.memory.target != undefined && creep.room.name != creep.memory.target) {
      var exit = creep.room.findExitTo(creep.memory.target);
      creep.moveTo(creep.pos.findClosestByRange(exit));
      return;
    }

    if (creep.memory.working && creep.carry.energy == 0) {
      creep.memory.working = false;
    } else if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
      creep.say('🛠 build');
    }

    if (creep.memory.working) {
      var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      if (target) {
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {
            visualizePathStyle: {
              stroke: '#ffffff'
            }
          });
        }
      } else {
        roleUpgrader.run(creep);
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
