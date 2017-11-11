require('prototype.spawner')();

export default {
  init(room) {
    // Initialize room memory for spawn if not already initialized
    room.memory.roles = room.memory.roles === undefined ? {} : room.memory.roles;
    room.memory.creepCount = room.memory.creepCount === undefined ? {} : room.memory.creepCount;
    room.memory.remoteHarvestRooms = room.memory.remoteHarvestRooms === undefined ? {} : room.memory.remoteHarvestRooms;
    // if (room.memory.roles === undefined) {
    //   room.memory.roles = {};
    // }
    // if (room.memory.creepCount === undefined) {
    //   room.memory.creepCount = {};
    // }
    // if (room.memory.remoteHarvestRooms === undefined) {
    //   room.memory.remoteHarvestRooms = {};
    // }

    // Get creep count and energy capacity
    const creeps = room.find(FIND_MY_CREEPS);
    const energy = room.energyCapacityAvailable;

    // Store energy capacity for room
    room.memory.energyCapacity = room.memory.energyCapacity !== energy ? energy : room.memory.energyCapacity;

    // Get counts for each role and store in memory
    // const roles = [
    //   'harvester',
    //   'haulerMining',
    //   'haulerSpawning',
    //   'upgrader',
    //   'repairer',
    //   'builder',
    //   'claimer'
    // ];
    let roles = [
      {id: 0, type: 'harvester'},
      {id: 1, type: 'haulerMining'},
      {id: 2, type: 'haulerSpawning'},
      {id: 3, type: 'upgrader'},
      {id: 4, type: 'repairer'},
      {id: 5, type: 'builder'},
      {id: 6, type: 'claimer'}
    ];
    roles = _.sortBy(roles, [(o) => o.id]);
    for (const role of roles) {
      eval(`var ${role.type} = ${_.sum(creeps, (c) => c.memory.role == role.type)}`);
      if (eval(`${role.type}`) && eval(`room.memory.creepCount.${role.type}`) !== eval(`${role.type}`)) {
        eval(`room.memory.creepCount.${role.type} = ${role.type}`);
      } else if (eval(`${role.type}`) === undefined) {
        eval(`room.memory.creepCount.${role.type} = ${role.type}`);
      }
    }

    // Get counts for long distance harvesters
    var remoteHarvestRooms = room.memory.remoteHarvestRooms;
    for (let remoteHarvestRoom in remoteHarvestRooms) {
      eval(`var longDistanceHarvesters${remoteHarvestRoom} = ${_.sum(Game.creeps, (c) => c.memory.role == 'longDistanceHarvester' && c.memory.target == remoteHarvestRoom)}`);
      if (eval(`longDistanceHarvesters${remoteHarvestRoom}`) && eval(`room.memory.creepCount.harvestersLD${remoteHarvestRoom}`) != eval(`longDistanceHarvesters${remoteHarvestRoom}`)) {
        eval(`room.memory.creepCount.harvestersLD${remoteHarvestRoom} = longDistanceHarvesters${remoteHarvestRoom}`);
      } else if (eval(`room.memory.creepCount.harvestersLD${remoteHarvestRoom}`) == undefined) {
        eval(`room.memory.creepCount.harvestersLD${remoteHarvestRoom} = 0`);
      }
    }
  },

  spawnCreep(spawn, room, type) {
    if (room.memory.creepCount[type] < room.memory.roles[type]) {
      if (room.memory.energyCapacity > 1200) {
        var energyCapacity = room.memory.energyCapacity / 4;
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

  run(spawn) {
    const room = spawn.room;
    this.init(room);

    const roles = room.memory.roles;
    for (const role in roles) {
      if ((room.memory.creepCount.harvester <= (room.memory.roles.harvester / 2)) && role === 'harvester') {
        this.spawnCreep(spawn, room, role);
      } else if (room.memory.creepCount.harvester > (room.memory.roles.harvester / 2)) {
        this.spawnCreep(spawn, room, role);
      }
    }

    if ((room.memory.roles.haulerSpawning == undefined || room.memory.creepCount.haulerSpawning == room.memory.roles.haulerSpawning) && (room.memory.roles.harvester == undefined || room.memory.creepCount.harvester == room.memory.roles.harvester)) {
      var remoteHarvestRooms = room.memory.remoteHarvestRooms;
      for (let remoteHarvestRoom in remoteHarvestRooms) {
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
    }

    if (spawn.spawning) {
      let spawningCreep = Game.creeps[spawn.spawning.name];
      spawn.room.visual.text(`🛠${spawningCreep.memory.role}`, spawn.pos.x + 1, spawn.pos.y, {
        align: 'left',
        opacity: 0.8
      });
    }
  }
};
