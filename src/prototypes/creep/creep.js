require('./role')

Creep.prototype.findEnergyAndFreeSpot = function() {
  if (this.memory.role === 'miner') {
    return this.findMinerTarget();
  } else {
    return this.findGeneralTarget();
  }
};

Creep.prototype.findMinerTarget = function() {
  const source = this.pos.findClosestByRange(FIND_SOURCES);
  const link = this.room.find(FIND_STRUCTURES, {
    filter: (structure) => structure.structureType === STRUCTURE_LINK &&
      this.pos.isNearTo(structure.pos)
  })[0];

  if (!source) {
    return null;
  }

  const containers = this.room.find(FIND_STRUCTURES, {
    filter: (structure) => structure.pos.lookFor(LOOK_ENERGY) && structure.structureType === STRUCTURE_CONTAINER
  });

  const freeContainer = containers.find((container) => {
    const creepsOnContainer = container.pos.lookFor(LOOK_CREEPS);
    if(this.pos.isEqualTo(container.pos)) {
      return true
    }
    return !creepsOnContainer.length || (creepsOnContainer.length && creepsOnContainer[0].memory.role !== 'miner');
  });

  if (freeContainer) {
    if (this.pos.isEqualTo(freeContainer.pos)) {
      if(!this.store.getFreeCapacity() && link) {
        this.transfer(link, RESOURCE_ENERGY)
      }
      if (!this.store.getFreeCapacity() && !link) {
        this.drop(RESOURCE_ENERGY)
      }
      this.harvest(source);
    } else {
      this.moveTo(freeContainer);
      if(Memory.buildRoad) {
        Game.rooms[this.room.name].createConstructionSite(this.pos, STRUCTURE_ROAD);
      }
    }
    return freeContainer;
  } else {
    if (this.pos.isNearTo(source)) {
      this.harvest(source);
    } else {
      this.moveTo(source);
      if(Memory.buildRoad) {
        Game.rooms[this.room.name].createConstructionSite(this.pos, STRUCTURE_ROAD);
      }
    }
    return source;
  }
};

Creep.prototype.findGeneralTarget = function() {
  const containers = _.sortBy(this.room.findContainersNear(), container => this.pos.getRangeTo(container.pos))
  const links = this.room.findLinksNear();
  const droppedResources = this.room.findDroppedResources(RESOURCE_ENERGY);
  const tombstones = this.room.findTombstonesWithResource(RESOURCE_ENERGY);
  const ruins = this.room.findRuinsWithResource(RESOURCE_ENERGY);
  const storage = this.room.storage

  const linksOnStorage = _.filter(links, link => link.pos.isNearTo(storage.pos))

  const targets = [].concat(droppedResources || [], tombstones || [], ruins || [], linksOnStorage || [], containers || []).filter(Boolean);

  const freeTarget = targets.find((target) => target.store && target.store[RESOURCE_ENERGY] >= this.store.getFreeCapacity());

  if(this.getFreeCapacityStructures().length > 0) {
    if(storage && storage.store[RESOURCE_ENERGY] > Math.pow(10, 5)) {
      this.moveToAndCollect(storage);
      return storage;
    }
  }

  if (freeTarget) {
    this.moveToAndCollect(freeTarget);
    return freeTarget;
  }

  const sourceData = this.pos.findOpenSource(RESOURCE_ENERGY);

  if (sourceData) {
    this.moveToAndHarvest(sourceData);
    return sourceData;
  }

  return null;
};

Creep.prototype.moveToAndCollect = function(target) {
  if (this.pos.isNearTo(target)) {
    if (target instanceof Resource) {
      this.pickup(target);
    } else {
      this.withdraw(target, RESOURCE_ENERGY);
    }
  } else {
    this.moveTo(target);
    if(Memory.buildRoad) {
      Game.rooms[this.room.name].createConstructionSite(this.pos, STRUCTURE_ROAD);
    }
  }
};

Creep.prototype.moveToAndHarvest = function(source) {
  if (this.pos.isNearTo(source)) {
    this.harvest(source);
  } else {
    this.moveTo(source);
    if(Memory.buildRoad) {
      Game.rooms[this.room.name].createConstructionSite(this.pos, STRUCTURE_ROAD);
    }
  }
};
