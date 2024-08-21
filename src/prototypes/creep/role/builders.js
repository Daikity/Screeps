Creep.prototype.buildingController = function () {
  if(this.memory.working && this.store[RESOURCE_ENERGY] == 0) {
    this.memory.working = false;
    this.memory.building = false;
  }
  if(!this.memory.working && this.store.getFreeCapacity() == 0) {
    this.memory.working = true;
    this.memory.building = true;
  }

  if(this.memory.working) {
    const targets = this.room.find(FIND_CONSTRUCTION_SITES);
    if(targets.length) {
      const constructionsIsNotRoad = _.filter(targets, target => {
        return target.structureType !== STRUCTURE_ROAD;
      });

      const construction = constructionsIsNotRoad.length > 0 ? constructionsIsNotRoad[0] : targets[0]
      if(this.build(construction) == ERR_NOT_IN_RANGE) {
        this.moveTo(construction);
      }

      return true
    }
  }
  this.memory.building = false;
  return false
}
