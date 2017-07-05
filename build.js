module.exports = {
  run: function(fromPos, toPos, building) {
    var pfad = currentSpawn.room.findPath(fromPos, toPos, {ignoreCreeps: true})
    for (var i in pfad) {
      GamecurrentRoom.createConstructionSite(pfad[i].x, pfad[i].y, building);
    }
  }
};
