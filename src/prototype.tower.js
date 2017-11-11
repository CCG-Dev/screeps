StructureTower.prototype.defend = () => {
  const target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if (target !== undefined) {
    this.attack(target);
  }
};
