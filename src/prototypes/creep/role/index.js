require('./harvesters')
require('./upgraders')
require('./builders')
require('./miners')
require('./heelers')
require('./military')
require('./defenders')
require('./deliverymans')
require('./linkLoader')


Creep.prototype.fineEnergySource = function () {
  const sources = _.sortBy(this.room.find(FIND_SOURCES), (source) => {
    return source.pos.getRangeTo(this.pos.x, this.pos.y)
  });

  if(sources.length) {
    if(!Memory.sources) {
      Memory.sources = {}
      Memory.sources[this.room.name] = []
      _.forEach(sources, source => {
        Memory.sources[this.room.name].push(source.id)
      })
    }
    const hearRoom = _.find(Memory.sources, roomName => this.room.name === roomName)
    if(!hearRoom) {
      _.forEach(sources, source => {
        Memory.sources[this.room.name] = []
        Memory.sources[this.room.name].push(source.id)
      })
    }
    const source = _.find(sources, (s) => s.pos.getOpenPosition().length > 0)
    if(source) this.memory.source = source.id
    return sources
  }
}

Creep.prototype.findContainers = function () {
  const findContainers = this.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_CONTAINER &&
        structure.store.getUsedCapacity(RESOURCE_ENERGY) >= this.store.getFreeCapacity(RESOURCE_ENERGY);
    }
  });

  if (findContainers) {
    return _.sortBy(findContainers, (container) => {
      return container.pos.getRangeTo(this.pos.x, this.pos.y)
    });
  }
  return false
}

Creep.prototype.harvestSources = function () {
  const source = Game.getObjectById(this.memory.source)
  const containers = this.findContainers()
  const storageLink = Memory.config.storageLink ? Game.getObjectById(Memory.config.storageLink) : undefined

  if(this.store.getFreeCapacity() > 0 && !this.memory.working) {

    if (this.takeDropEnergy()) {
      this.memory.isHarvest = false
      return true
      if (!this.store.getFreeCapacity()) {
      }
    }


    if (storageLink && this.memory.role !== 'miner' && storageLink.energy > 0) {
      if (this.takeEnergyFromLink()) {
        this.memory.isHarvest = false
        return true
      }
      return false
    }

    if (containers.length > 0 && this.memory.role !== 'miner') {
      const container = _.find(containers, cont => cont.id === this.memory.container)
      if(!container) {
        this.memory.container = containers[0].id
      }
      if (container && container.store.getUsedCapacity() > 0) {
        if (this.takeEnergyFromContainer(this.memory.container)) {
          this.memory.isHarvest = false
          return true
        }
        return false
      }
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
      this.pos.isNearTo(source) ? this.harvest(source) : this.moveTo(source)
    }
    return false
  }
  this.memory.isHarvest = false
  return true
}

Creep.prototype.takeEnergyFromContainer = function (containerId) {
  const containers = this.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_CONTAINER &&
        structure.id === containerId;
    }
  });
  if(containers.length > 0) {
    const source = this.pos.findClosestByPath(containers)
    if(this.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.moveTo(source);
    }
    return false;
  }
  return true
}

Creep.prototype.takeEnergyFromLink = function() {
  const storageLink = Memory.config.storageLink ? Game.getObjectById(Memory.config.storageLink) : undefined
  if(storageLink) {
    if(this.withdraw(storageLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.moveTo(storageLink);
    }
    return false;
  }
  return true
}

Creep.prototype.takeDropEnergy = function () {
  const dropSources = this.room.find(FIND_DROPPED_RESOURCES)
  const tombstones = this.room.find(FIND_TOMBSTONES)
  const ruins = this.room.find(FIND_RUINS)

  if(dropSources) {
    const dropSource = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
    if(this.pickup(dropSource) == ERR_NOT_IN_RANGE) {
      this.moveTo(dropSource);
    }
    return false;
  }
  if (tombstones) {
    const tombstone = this.pos.findClosestByRange(tombstones)
    if(this.withdraw(tombstone, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.moveTo(tombstone);
    }
    return false;
  }
  if (ruins) {
    const ruin = this.pos.findClosestByRange(ruins)
    if(this.withdraw(ruin, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.moveTo(ruin);
    }
    return false;
  }
  return true
}
