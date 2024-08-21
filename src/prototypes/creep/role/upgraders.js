Creep.prototype.upgradingController = function () {
  if(this.memory.working && this.store[RESOURCE_ENERGY] == 0) {
    this.memory.working = false;
  }
  if(!this.memory.working && this.store.getFreeCapacity() == 0) {
    this.memory.working = true;
  }

  if(this.memory.working && !this.memory.building) {
    if(this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
      this.moveTo(this.room.controller);
    }
  }
}
