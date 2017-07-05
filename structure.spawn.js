require('prototype.spawner')();

module.exports = {
  init: function(room) {
    // Initialize room memory for spawn if not already initialized
    if (room.memory.roles == undefined) {
      room.memory.roles = {};
    }
    if (room.memory.creepCount == undefined) {
      room.memory.creepCount = {};
    }
    if (room.memory.remoteHarvestRooms == undefined) {
      room.memory.remoteHarvestRooms = {};
    }

    // Get creep count and energy capacity
    let creeps = room.find(FIND_MY_CREEPS);
    let energy = room.energyCapacityAvailable;

    // Store energy capacity for room
    if (room.memory.energyCapacity == undefined || room.memory.energyCapacity != energy) {
      room.memory.energyCapacity = energy;
    }

    // Get counts for each role and store in memory
    var roles = ['harvester','haulerMining','haulerSpawning','upgrader','repairer','builder'];
    for (let role of roles) {
      eval(`var ${role} = ${_.sum(creeps, (c) => c.memory.role == role)}`);
      if (eval(`${role}`) && eval(`room.memory.creepCount.${role}`) != eval(`${role}`)) {
        eval(`room.memory.creepCount.${role} = ${role}`);
      } else if (eval(`${role}`) == undefined) {
        eval(`room.memory.creepCount.${role} = ${role}`);
      }
    }

    // Get counts for long distance harvesters
    //var remoteHarvestRooms = ['W6N3','W8N4','W8N3'];
    var remoteHarvestRooms = room.memory.remoteHarvestRooms;
    for (let remoteHarvestRoom in remoteHarvestRooms) {
      eval(`var longDistanceHarvesters${remoteHarvestRoom} = ${_.sum(Game.creeps, (c) => c.memory.role == 'longDistanceHarvester' && c.memory.target == remoteHarvestRoom)}`);
      if (eval(`longDistanceHarvesters${remoteHarvestRoom}`) && eval(`room.memory.creepCount.harvestersLD${remoteHarvestRoom}`) != eval(`longDistanceHarvesters${remoteHarvestRoom}`)) {
        eval(`room.memory.creepCount.harvestersLD${remoteHarvestRoom} = longDistanceHarvesters${remoteHarvestRoom}`);
      }
    }
  },

  spawnCreep: function(spawn, room, type) {
    if (room.memory.creepCount[type] < room.memory.roles[type]) {
      if (room.memory.energyCapacity > 800) {
        var energyCapacity = 800;
      } else {
        var energyCapacity = room.memory.energyCapacity;
      }
      let name = spawn.createCustomCreep(energyCapacity, type);
      if (name == ERR_NOT_ENOUGH_ENERGY && type == 'harvester' && room.memory.creepCount[type] <= 1) {
        name = spawn.createCustomCreep(spawn.room.energyAvailable, type);
      }
      if (name) {
        return name;
      }
    }
  },

  run: function(spawn) {
    let room = spawn.room;
    this.init(room);

    //var remoteHarvestRooms = ['W8N4','W8N3','W6N3'];
    var remoteHarvestRooms = room.memory.remoteHarvestRooms;
    for (let remoteHarvestRoom in remoteHarvestRooms) {
      //if (eval(`room.memory.creepCount.harvestersLD${remoteHarvestRoom}`) < eval(`room.memory.minLD${remoteHarvestRoom}`)) {
      if (eval(`room.memory.creepCount.harvestersLD${remoteHarvestRoom}`) < eval(`room.memory.remoteHarvestRooms.${remoteHarvestRoom}`)) {
        if (room.memory.energyCapacity > 700) {
          var energyCapacity = 700;
        } else {
          var energyCapacity = room.memory.energyCapacity;
        }
        if (room.memory.creepCount.harvester > 0 && room.memory.creepCount.haulerMining > 0) {
          if (room.memory.roles.haulerSpawning != undefined && room.memory.creepCount.haulerSpawning > 0) {
            spawn.createLongDistanceHarvester(energyCapacity, 2, room.name, remoteHarvestRoom, 0);
          } else {
            spawn.createLongDistanceHarvester(energyCapacity, 2, room.name, remoteHarvestRoom, 0);
          }
        }
      }
    }

    var roles = ['builder','repairer','upgrader','haulerMining','haulerSpawning','harvester'];
    for (let role of roles) {
      this.spawnCreep(spawn, room, role);
    }


    if (spawn.spawning) {
      let spawningCreep = Game.creeps[spawn.spawning.name];
      spawn.room.visual.text('🛠' + spawningCreep.memory.role, spawn.pos.x + 1, spawn.pos.y, {
        align: 'left',
        opacity: 0.8
      });
    }
  }
};
