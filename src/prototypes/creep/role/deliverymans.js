Creep.prototype.transferToStorage = function () {
  const storage = this.room.storage
  if(storage) {
    if(this.pos.isNearTo(storage)) {
      this.transfer(storage, RESOURCE_ENERGY)
      this.memory.working = false;
    } else {
      this.moveTo(storage);
    }
    return true;
  }
  this.memory.working = false;
  return false;
}
