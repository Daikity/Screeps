Creep.prototype.harvester = function() {
  const storage = this.room.storage
  const spawn = this.room.find(FIND_STRUCTURES, {
    filter: (structure) =>  structure.structureType == STRUCTURE_SPAWN &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
  })[0]
  const structures = _.sortBy(this.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return (
        structure.structureType == STRUCTURE_EXTENSION ||
        structure.structureType == STRUCTURE_TOWER ) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  }), structure => this.pos.getRangeTo(structure.pos))

  const targetUpload = [].concat(spawn || [], structures || [], storage || [])[0]

  if (this.store.getFreeCapacity() > 0) {
    const target = this.findEnergyAndFreeSpot();
    if (target) {
      this.moveToAndCollect(target);
    }
  } else {
    if(targetUpload && this.transfer(targetUpload, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.moveTo(targetUpload, {
        visualizePathStyle: {
          stroke: '#0c985b',
          opacity: 0.4
        }
      });
    }
  }
};
