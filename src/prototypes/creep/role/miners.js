Creep.prototype.miner = function() {
  this.findEnergyAndFreeSpot();
};

Creep.prototype.mineMinerals = function () {
  const mineral = this.room.find(FIND_MINERALS)[0]
  const storage = this.room.storage
  const extractor = this.room.find(FIND_STRUCTURES, {
    filter: (structure) => structure.structureType === STRUCTURE_EXTRACTOR
  })[0]

  if (extractor && extractor.length > 0) {
    if (this.store.getFreeCapacity() > 0) {
      this.pos.isNearTo(mineral) ? this.harvest(mineral) : this.moveTo(mineral)
    } else {
      if (storage) {
        this.pos.isNearTo(storage) ? this.transfer(storage, mineral.mineralType) : this.moveTo(storage)
      } else return false
    }
    return true
  }
  return false
}
