Creep.prototype.harvester = function() {
  const storage = this.room.storage
  const structure = this.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return (
        structure.structureType == STRUCTURE_EXTENSION ||
        structure.structureType == STRUCTURE_SPAWN ||
        structure.structureType == STRUCTURE_TOWER ) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  })
  // .sort((a, b) => a.pos.getRangeTo(a) - b.pos.getRangeTo(b));
  const targetUpload = structure.length > 0 ? structure[0] : (storage ? storage : this.say('Where?'));
  if (this.store.getFreeCapacity() > 0) {
    const target = this.findEnergyAndFreeSpot();
    if (target) {
      this.moveToAndCollect(target);
    }
  } else {
    if(this.transfer(targetUpload, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.moveTo(targetUpload);
    }
  }
};
