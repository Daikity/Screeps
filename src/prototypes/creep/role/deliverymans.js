Creep.prototype.transferToStorage = function () {
  if (this.store.getFreeCapacity() > 0 && !this.memory.work) {
    // const target = ??? TODO: need target object for transfer operation
    // if (target) {
    //   this.moveToAndCollect(target);
    // }

    // TODO: add target source for transfer to storage
  } else {
    if (!this.store.getUsedCapacity()) {
      this.memory.work = false
    } else {
      this.memory.work = true
      const storage = this.room.storage
      if(storage) {
        if(this.pos.isNearTo(storage)) {
          this.transfer(storage, RESOURCE_ENERGY)
        } else {
          this.moveTo(storage);
        }
      }
    }
  }
}
