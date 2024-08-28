Creep.prototype.transferSource = function () {
  const storage = this.room.storage
  const targets = this.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return (
        structure.structureType == STRUCTURE_EXTENSION ||
        structure.structureType == STRUCTURE_SPAWN ||
        structure.structureType == STRUCTURE_TOWER ) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
  if(targets.length > 0) {
    if(this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.moveTo(targets[0]);
    } else this.memory.working = false;
    return true;
  } else {
    if (storage) {
      if(this.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(storage);
      } else this.memory.working = false;
      return true;
    }
  }
  this.memory.working = false;
  return false;
}
