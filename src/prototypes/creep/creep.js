const { arrayMoveBack } = require('../../libs')
Creep.prototype.fineEnergySource = function () {
  const sources = this.room.find(FIND_SOURCES)
  if(sources.length) {
    if(!Memory.sources) {
      Memory.sources = []
      _.forEach(sources, source => {
        Memory.sources.push(source.id)
      })
    }
    const source = _.find(sources, (s) => s.pos.getOpenPosition().length > 0)
    if(source) this.memory.source = source.id
    return sources
  }
}

Creep.prototype.harvestSources = function () {
  const source = Game.getObjectById(this.memory.source)

  if(this.store.getFreeCapacity() > 0 && !this.memory.working) {
    if(!source || (!source.pos.getOpenPosition().length > 0 && !this.pos.isNearTo(source))) {
      if(source && Memory.sources) {
        _.forEach(Memory.sources, src => {
          let sources = Memory.sources
          if(src === this.memory.source) {
            this.memory.source = arrayMoveBack(sources)[0]
            return;
          }
          sources = arrayMoveBack(sources)
        })
      } else {
        delete this.memory.source
        this.fineEnergySource()
      }
    }
    if(source) {
      const danger = source.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
      if(danger.length > 0) {
        this.say('OMG!😨');
        if(Memory.sources) {
          _.forEach(Memory.sources, src => {
            let sources = Memory.sources
            if(src === this.memory.source) {
              this.memory.source = arrayMoveBack(sources)[0]
              return;
            }
            sources = arrayMoveBack(sources)
          })
        } else {
          delete this.memory.source
          this.fineEnergySource()
        }
      }
    }
    source && this.pos.isNearTo(source) ? this.harvest(source) : this.moveTo(source)
    return false
  }
  this.memory.isHarvest = false
  return true
}

Creep.prototype.transferSource = function () {
  const targets = this.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return (
        structure.structureType == STRUCTURE_EXTENSION ||
        structure.structureType == STRUCTURE_SPAWN ||
        structure.structureType == STRUCTURE_TOWER ||
        structure.structureType == STRUCTURE_CONTAINER ) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
  if(targets.length > 0) {
    if(this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.moveTo(targets[0]);
    } else this.memory.working = false;
    return true;
  }
  this.memory.working = false;
  return false;
}

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
      if(this.build(targets[0]) == ERR_NOT_IN_RANGE) {
        this.moveTo(targets[0]);
      }
      return true
    }
  }
  this.memory.building = false;
  return false
}

Creep.prototype.run = function (memoryCreep) {
  const storageIsFull = this.memory.isHarvest ? this.harvestSources() : true;

  const MIN_CREEPS_OF_ONE_TYPE = 3;
  // add role if not found in memory
  const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
  const upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length;
  const builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;

  if(!Boolean(this.memory.role)) {
    this.memory.working = false;
    this.memory.isHarvest = false;
    switch (true) {
      case (memoryCreep && memoryCreep.harvesters < harvesters) || harvesters < MIN_CREEPS_OF_ONE_TYPE:
        this.memory.role = 'harvester'
        break;
      case (memoryCreep && memoryCreep.upgrader < upgrader) || upgrader < MIN_CREEPS_OF_ONE_TYPE:
        this.memory.role = 'upgrader'
        break;
      case (memoryCreep && memoryCreep.builder < builder) || builder < MIN_CREEPS_OF_ONE_TYPE:
        this.memory.role = 'builder'
        break;
      default:
        this.memory.role = 'harvester'
        break;
    }
  }

  if (this.store.getUsedCapacity() === 0) {
    this.memory.isHarvest = true
  }

  switch (true) {
    case storageIsFull && this.memory.role === 'harvester' && this.transferSource():
      break;
    case storageIsFull && this.memory.role === 'builder' && (this.buildingController() || this.transferSource()):
      break;
    default:
      if (storageIsFull) {
        this.memory.working = true;
        this.upgradingController()
      }
      break;
  }
}
