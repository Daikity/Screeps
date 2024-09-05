Creep.prototype.repairer = function () {
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
      const structures = _.sortBy(this.room.find(FIND_STRUCTURES, {
        filter: object => object.hits < object.hitsMax && object.structureType !== STRUCTURE_WALL
      }),[target => Math.floor(target.hits / target.hitsMax * 100) < 80], [target => target.hits])

      const walls = _.sortBy(this.room.find(FIND_STRUCTURES, {
        filter: object => object.hits < object.hitsMax && object.structureType === STRUCTURE_WALL
      }),[target => Math.floor(target.hits / target.hitsMax * 100) < 80], [target => target.hits])

      const targets = [].concat(structures, walls)

      if(targets.length > 0) {
        if(this.repair(targets[0]) == ERR_NOT_IN_RANGE) {
            this.moveTo(targets[0], {
              visualizePathStyle: {
                stroke: '#1577a4',
                opacity: 0.4
              }
            });
        }
      }
    }
  }
}
