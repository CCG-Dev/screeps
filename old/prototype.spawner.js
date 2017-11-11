export default () => {
  StructureSpawn.prototype.createCustomCreep = function(energy, roleName) {
    var numberOfParts = Math.floor(energy / 200);
    var body = [];
    if (roleName == 'haulerMining' || roleName == 'haulerSpawning') {
      for (let i = 0; i < numberOfParts * 2; i++) {
        body.push(CARRY);
      }
      for (let i = 0; i < numberOfParts * 2; i++) {
        body.push(MOVE);
      }
    } else if (roleName == 'harvester') {
      for (let i = 0; i < numberOfParts * 2; i++) {
        body.push(WORK);
      }
      for (let i = 0; i < numberOfParts / 2; i++) {
        body.push(CARRY);
      }
      for (let i = 0; i < numberOfParts / 2; i++) {
        body.push(MOVE);
      }
    } else {
      for (let i = 0; i < numberOfParts; i++) {
        body.push(WORK);
      }
      for (let i = 0; i < numberOfParts; i++) {
        body.push(CARRY);
      }
      for (let i = 0; i < numberOfParts; i++) {
        body.push(MOVE);
      }
    }
    var d = new Date();
    var newName = `${roleName}-${d.getTime()}`;

    return this.createCreep(body, newName, {
      role: roleName,
      home: this.room.name,
      working: false
    });
  };

  StructureSpawn.prototype.createLongDistanceHarvester = function(energy, numberOfWorkParts, home, target, sourceIndex) {
    var body = [];
    for (let i = 0; i < numberOfWorkParts; i++) {
      body.push(WORK);
    }

    energy -= 150 * numberOfWorkParts;

    var numberOfParts = Math.floor(energy / 100);
    for (let i = 0; i < numberOfParts; i++) {
      body.push(CARRY);
    }
    for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
      body.push(MOVE);
    }
    var d = new Date();
    var newName = `longDistanceHarvester-${d.getTime()}`;

    return this.createCreep(body, newName, {
      role: 'longDistanceHarvester',
      home,
      target,
      sourceIndex,
      working: false
    });
  };

  StructureSpawn.prototype.createClaimer = function(target) {
    return this.createCreep([
      CLAIM, MOVE
    ], undefined, {
      role: 'claimer',
      target
    });
  }
};
