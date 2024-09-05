Creep.prototype.miner = function() {
  this.findEnergyAndFreeSpot();
};

Creep.prototype.mineralMiner = function () {
  const mineral = this.room.find(FIND_MINERALS)[0]
  const storage = this.room.storage
  const extractor = this.room.find(FIND_STRUCTURES, {
    filter: (structure) => structure.structureType === STRUCTURE_EXTRACTOR
  })[0]

  if (extractor) {
    if (this.store.getFreeCapacity() > 0) {
      this.pos.isNearTo(mineral) ? this.harvest(mineral) : this.moveTo(mineral)
    } else {
      if (storage) {
        if(this.transfer(storage, mineral.mineralType) === ERR_NOT_IN_RANGE) {
          this.moveTo(storage)
        }
      }
    }
  }
}
