var Respawner = {
  run(moneyAvai, currentSpawn) {
    //var moneyAvai = Game.rooms['W7N4'].energyCapacityAvailable;
    //moneyAvai = 300;
    var harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repairer = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var hauler = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');

    var settlerBody = [
      CLAIM,
      WORK,
      WORK,
      WORK,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE
    ];

    if (harvester.length < 6) {
      if (moneyAvai >= 800) {
        var newName = Game.spawns[currentSpawn].createCreep([
          WORK,
          WORK,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          MOVE,
          MOVE,
          MOVE,
          MOVE,
          MOVE
        ], undefined, {
          role: 'harvester',
          source: ''
        });
      } else if (moneyAvai >= 550) {
        var newName = Game.spawns[currentSpawn].createCreep([
          WORK,
          WORK,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          MOVE,
          MOVE,
          MOVE
        ], undefined, {
          role: 'harvester',
          source: ''
        });
      } else {
        var newName = Game.spawns[currentSpawn].createCreep([
          WORK, CARRY, CARRY, MOVE, MOVE
        ], undefined, {
          role: 'harvester',
          source: ''
        });
      }
      console.log(`Spawning new harvester: ${newName}`);
    } else if (hauler.length < 2) {
      if (moneyAvai >= 800) {
        var newName = Game.spawns[currentSpawn].createCreep([
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          MOVE,
          MOVE,
          MOVE,
          MOVE,
          MOVE,
          MOVE,
          MOVE,
          MOVE,
          MOVE
        ], undefined, {role: 'hauler'});
      } else if (moneyAvai >= 550) {
        var newName = Game.spawns[currentSpawn].createCreep([
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          MOVE,
          MOVE,
          MOVE,
          MOVE
        ], undefined, {role: 'hauler'});
      } else {
        var newName = Game.spawns[currentSpawn].createCreep([
          CARRY, CARRY, CARRY, MOVE
        ], undefined, {role: 'hauler'});
      }
      console.log(`Spawning new hauler: ${newName}`);
    } else if (upgrader.length < 4) {
      if (moneyAvai >= 800) {
        var newName = Game.spawns[currentSpawn].createCreep([
          WORK,
          WORK,
          WORK,
          WORK,
          WORK,
          CARRY,
          CARRY,
          CARRY,
          MOVE,
          MOVE
        ], undefined, {role: 'upgrader'});
      } else if (moneyAvai >= 550) {
        var newName = Game.spawns[currentSpawn].createCreep([
          WORK,
          WORK,
          WORK,
          CARRY,
          CARRY,
          CARRY,
          MOVE,
          MOVE
        ], undefined, {role: 'upgrader'});
      } else {
        var newName = Game.spawns[currentSpawn].createCreep([
          WORK, CARRY, CARRY, CARRY, MOVE
        ], undefined, {role: 'upgrader'});
      }
      console.log(`Spawning new upgrader: ${newName}`);
    } else if (builder.length < 1) {
      if (moneyAvai >= 800) {
        var newName = Game.spawns[currentSpawn].createCreep([
          WORK,
          WORK,
          WORK,
          WORK,
          WORK,
          CARRY,
          CARRY,
          MOVE,
          MOVE,
          MOVE
        ], undefined, {role: 'builder'});
      } else if (moneyAvai >= 550) {
        var newName = Game.spawns[currentSpawn].createCreep([
          WORK,
          WORK,
          WORK,
          CARRY,
          CARRY,
          MOVE,
          MOVE,
          MOVE
        ], undefined, {role: 'builder'});
      } else {
        var newName = Game.spawns[currentSpawn].createCreep([
          WORK, CARRY, WORK, MOVE
        ], undefined, {role: 'builder'});
      }
      console.log(`Spawning new builder: ${newName}`);
    } else if (repairer.length < 1) {
      if (moneyAvai >= 800) {
        var newName = Game.spawns[currentSpawn].createCreep([
          WORK,
          WORK,
          WORK,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          MOVE,
          MOVE,
          MOVE,
          MOVE,
          MOVE,
          MOVE
        ], undefined, {role: 'repairer'});
      } else if (moneyAvai >= 550) {
        var newName = Game.spawns[currentSpawn].createCreep([
          WORK,
          WORK,
          CARRY,
          CARRY,
          CARRY,
          MOVE,
          MOVE,
          MOVE,
          MOVE
        ], undefined, {role: 'repairer'});
      } else {
        var newName = Game.spawns[currentSpawn].createCreep([
          WORK, WORK, CARRY, MOVE
        ], undefined, {role: 'repairer'});
      }
      console.log(`Spawning new repairer: ${newName}`);
    }
  }
};

export default Respawner;
