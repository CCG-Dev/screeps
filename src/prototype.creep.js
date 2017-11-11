var roles = {
  harvester: require('role.harvester'),
  upgrader: require('role.upgrader'),
  builder: require('role.builder'),
  repairer: require('role.repairer'),
  longDistanceHarvester: require('role.longDistanceHarvester'),
  claimer: require('role.claimer'),
  //miner: require('role.miner'),
  //lorry: require('role.lorry')
};

Creep.prototype.runRole = () => {
  roles[this.memory.role].run(this);
};

Creep.prototype.getEnergy = (useContainer, useSource) => {
  let container;
  if (useContainer) {
    container = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s => (s.structureType == STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > 0
    });
    if (container !== undefined) {
      if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(container);
      }
    }
  }
  if (container === undefined && useSource) {
    if (this.memory.role == 'harvester' || this.memory.role == 'longDistanceHarvester') {
      if (this.memory.source == undefined) {
        roles[this.memory.role].assignSource(this);
      }
      var sourceID = this.memory.source;
      if (sourceID) {
        var source = Game.getObjectById(sourceID);
      }
    } else {
      var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    }
    if (this.harvest(source) === ERR_NOT_IN_RANGE) {
      this.moveTo(source, {
        visualizePathStyle: {
          stroke: '#ffffff'
        }
      });
    }
  }
};
