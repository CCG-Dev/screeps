export default {
  assignSource(creep) {
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
    //creep.room.roles.maxHarvesters = maxHarvesters;
  },
  run(creep) {
    if (creep.memory.working == true && creep.carry.energy == 0) {
      creep.memory.working = false;
    } else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
    }

    if (creep.memory.working == true) {
      if (creep.room.name == creep.memory.home) {
        var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (s) => {
            return ((s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] < s.storeCapacity) || ((s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity);
          }
        });
        if (structure == undefined) {
          structure = creep.room.storage;
        }
        if (structure != undefined) {
          if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(structure);
          }
        }
      } else {
        var exit = creep.room.findExitTo(creep.memory.home);
        creep.moveTo(creep.pos.findClosestByPath(exit));
      }
    } else {
      if (creep.room.name == creep.memory.target) {
        //creep.getEnergy(false, true);

        if (creep.memory.source == undefined || creep.memory.source == '') {
          creep.memory.source = '';
          this.assignSource(creep);
        }
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
        var exit = creep.room.findExitTo(creep.memory.target);
        creep.moveTo(creep.pos.findClosestByPath(exit));
      }
    }
  }
};
