var roleUpgrader = {
  run = creep => {
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
    }
    if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
    }

    if (creep.memory.working == true) {
      if (creep.room.controller) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.controller, {
            visualizePathStyle: {
              stroke: '#ffffff'
            }
          });
        }
      }
    } else {
      creep.getEnergy(true, true);
      /*
      var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => {
          return (s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0)
        }
      });
      if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
          visualizePathStyle: {
            stroke: '#ffaa00'
          }
        });
      }
      */
    }
  };
};

module.exports = roleUpgrader;
