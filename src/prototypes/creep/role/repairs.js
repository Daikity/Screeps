Creep.prototype.repair = function () {
  if (this.store.getFreeCapacity() > 0 && !this.memory.work) {
    const source = this.findEnergyAndFreeSpot();
    if (source) {
      this.moveToAndCollect(source);
    }
  } else {
    if (!this.store.getUsedCapacity()) {
      this.memory.work = false
    } else {
      this.memory.work = true
      const targets = _.sortBy(this.room.find(FIND_STRUCTURES, {
        filter: object => object.hits < object.hitsMax
      }), [target => target.hits >= Math.pow(10, 5), target => target.hits])

      if(targets.length > 0) {
        if(this.repair(targets[0]) == ERR_NOT_IN_RANGE) {
            this.moveTo(targets[0]);
        }
      }
    }
  }
}
