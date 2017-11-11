const common = {
  getFatigue = creep => {
    var body = creep.body;
    var nonMoveCount = 0;
    var moveCount = 0;
    var total = 0;
    for (var limb in body) {
      if (limb.type === MOVE) {
        moveCount++;
        total++;
      } else {
        nonMoveCount++;
        total++;
      }
    }
    return 2 * (nonMoveCount * 0.5 - moveCount);
  };

  distTo =(creep, pos) => {
    var x = creep.pos.x - pos.x;
    var y = creep.pos.y - pos.y;
    var xSquared = x * x;
    var ySquared = y * y;
    var root = xSquared + ySquared;
    var dist = Math.sqrt(root);
    return dist;
  };

  getEnergy = creep => {
    var maxTicks = 50;
    //Priority 1 is dropped energy, since it detiorates
    //TODO find why creeps will pick up compounds
    var dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    if (dropped && dropped.resourceType === RESOURCE_ENERGY) {
      var dist;
      var fat;
      var worth = 2;
      dist = this.distTo(creep, dropped.pos);
      fat = this.getFatigue(creep);
      worth = (dist * fat) / maxTicks;
      if (dropped && worth <= 1) {
        if (creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
          modCommon.move(creep, dropped.pos);
        } else {
          creep.memory.path = null;
        }
        return;
      }
    }
    //Next priority is the closest container or storage
    var storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (object) => ((object.structureType === STRUCTURE_CONTAINER) || (object.structureType === STRUCTURE_STORAGE)) && (object.store[RESOURCE_ENERGY] > creep.carryCapacity)
    });
    if (storage !== null) {
      var getEnergy = creep.withdraw(storage, RESOURCE_ENERGY, creep.carryCapacity - creep.carry);
      if (getEnergy === ERR_NOT_IN_RANGE) {
        common.move(creep, storage);
      } else {
        creep.memory.path = null;
      }
      //Finally, the creep will harvest if it can
    } else if (creep.memory.selfHarvest) {
      var source = creep.pos.findClosestByPath(FIND_SOURCES);
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        common.move(creep, source);
      } else {
        creep.memory.path = null;
      }
    }
  };

  move = (creep, pos) => {
    if (creep.pos.x === 0) {
      creep.move(RIGHT);
    } else if (creep.pos.x === 49) {
      creep.move(LEFT);
    } else if (creep.pos.y === 49) {
      creep.move(TOP);
    } else if (creep.pos.y === 0) {
      creep.move(BOTTOM);
    } else {
      var opts = {};
      var posStr = null;
      if (pos.roomName === undefined || pos.x === undefined || pos.y === undefined) {
        posStr = null;
      } else {
        posStr = pos.roomName + ":" + pos.x + "," + pos.y;
      }
      var creepPath = creep.memory.path;
      if (!creepPath || creep.memory.dest != posStr || posStr === null) {
        opts.ignoreCreeps = false;
        opts.serialize = true;
        if (pos.roomName == creep.room.name) {
          opts.maxOps = 1000;
        } else {
          opts.maxOps = 2000;
        }
        creep.memory.path = creep.pos.findPathTo(pos, opts);
        creep.memory.dest = posStr;
      }
      var result = creep.moveByPath(creep.memory.path);
      if (result != OK && result != ERR_TIRED) {
        creep.memory.path = null;
        //console.log("Move error: "+result);
      }
      return result;
    }
  };
};

export default common;
