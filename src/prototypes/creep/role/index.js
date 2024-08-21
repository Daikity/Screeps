require('./harvesters')
require('./upgraders')
require('./builders')
require('./miners')
require('./heelers')
require('./military')
require('./defenders')
require('./deliverymans')

Creep.prototype.fineEnergySource = function () {
  const sources = this.room.find(FIND_SOURCES)
  if(sources.length) {
    if(!Memory.sources) {
      Memory.sources = {}
      Memory.sources[this.room.name] = []
      _.forEach(sources, source => {
        Memory.sources[this.room.name].push(source.id)
      })
    }
    const source = _.find(sources, (s) => s.pos.getOpenPosition().length > 0)
    if(source) this.memory.source = source.id
    return sources
  }
}

Creep.prototype.harvestSources = function () {
  const source = Game.getObjectById(this.memory.source)
  const containers = this.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_CONTAINER &&
        structure.store.getUsedCapacity(RESOURCE_ENERGY) >= this.store.getFreeCapacity(RESOURCE_ENERGY);
    }
  });

  if(this.store.getFreeCapacity() > 0 && !this.memory.working) {
    if (containers.length > 0 && this.memory.role !== 'miner') {
      const container = _.find(containers, cont => cont.id === this.memory.container)
      if(!container) {
        this.memory.container = containers[0].id
      }
      if (this.takeEnergyFromContainer(this.memory.container)) {
        this.memory.isHarvest = false
        return true
      }
      return false
    }
    if(!_.find(this.body, body => body.type === WORK)) {
      this.memory.isHarvest = false
      return true
    }
    if(!source || (!source.pos.getOpenPosition().length > 0 && !this.pos.isNearTo(source))) {
      this.addSourceId()
    }
    if (source) {
      const danger = source.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
      if(danger.length > 0) {
        this.say('OMG!😨')
        this.addSourceId()
      }
      source && this.pos.isNearTo(source) ? this.harvest(source) : this.moveTo(source)
    }
    return false
  }
  this.memory.isHarvest = false
  return true
}

Creep.prototype.takeEnergyFromContainer = function (containerId) {
  const role = this.memory.role
  const containers = this.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_CONTAINER &&
        structure.id === containerId;
    }
  });
  const storages = this.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_STORAGE &&
        structure.store.getUsedCapacity() > 0 &&
        role !== 'deliveryman'
    }
  });
  const useStructure = storages.length > 0 ? storages : containers

  if(useStructure.length > 0) {
    const source = this.pos.findClosestByPath(useStructure)
    if(this.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.moveTo(source);
    }
    return false;
  }
  return true
}
