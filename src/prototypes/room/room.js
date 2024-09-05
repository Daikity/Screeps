Room.prototype.findContainersNear = function() {
  return this.find(FIND_STRUCTURES, {
    filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
      structure.store[RESOURCE_ENERGY] > 0 &&
      !this.find(FIND_HOSTILE_CREEPS, 5).length
  });
};

Room.prototype.findLinksNear = function() {
  return this.find(FIND_STRUCTURES, {
    filter: (structure) => structure.structureType === STRUCTURE_LINK &&
      structure.store[RESOURCE_ENERGY] > 0 &&
      this.find(FIND_MY_SPAWNS, 3).length > 0 &&
      !this.find(FIND_HOSTILE_CREEPS, 5).length
  });
};

Room.prototype.findDroppedResources = function(resourceType) {
  return this.find(FIND_DROPPED_RESOURCES, {
    filter: (resource) => resource.resourceType === resourceType &&
      !this.find(FIND_HOSTILE_CREEPS, 5).length
  });
};

Room.prototype.findTombstonesWithResource = function(resourceType) {
  return this.find(FIND_TOMBSTONES, {
    filter: (tombstone) => tombstone.store[resourceType] > 0 &&
      !this.find(FIND_HOSTILE_CREEPS, 5).length
  });
};

Room.prototype.findRuinsWithResource = function(resourceType) {
  return this.find(FIND_RUINS, {
    filter: (ruin) => ruin.store[resourceType] > 0 &&
      !this.find(FIND_HOSTILE_CREEPS, 5).length
  });
};
