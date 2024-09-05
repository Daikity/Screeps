Creep.prototype.upgrader = function() {

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
      if (this.pos.inRangeTo(this.room.controller, 3)) {
        this.upgradeController(this.room.controller);
      } else {
        this.moveTo(this.room.controller);
      }
    }
  }
};
