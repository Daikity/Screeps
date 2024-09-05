Creep.prototype.builder = function() {
  if (this.store.getFreeCapacity() > 0 && !this.memory.work) {
    const target = this.findEnergyAndFreeSpot();
    if (target) {
      this.moveToAndCollect(target);
    }
  } else {
    if (!this.store.getUsedCapacity()) {
      this.memory.work = false
    } else {
      this.memory.work = true
      const target = this.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
      if (target) {
        if (this.build(target) === ERR_NOT_IN_RANGE) {
          this.moveTo(target);
        }
      }
    }
  }
}
