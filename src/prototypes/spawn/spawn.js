const { makeId } = require('../../libs')
const { configForNewCreep } = require('../../configs')

StructureSpawn.prototype.activateTowers = function(isActive) {
  const towers = this.room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
  if(isActive){
    _.forEach(towers, tower => tower.defineActions());
  }
}

StructureSpawn.prototype.killCreeps = function(config) {
  const needRoles = []
  for (const key in config) {
    const countCreeps = _.filter(Game.creeps, creep => creep.memory.role === String(key).slice(0, -1))
    if (countCreeps.length > config[key]) {
      needRoles.push(key)
    }
  }
  const creep = _.find(Game.creeps, creep => !creep.memory.role)

  if (creep) {
    creep.suicide();
  }

  _.forEach(needRoles, role => {
    const creep = _.find(Game.creeps, creep => creep.memory.role === String(role).slice(0, -1))
    if (creep) {
      creep.suicide();
    }
  })
}

StructureSpawn.prototype.createNewCreep = function(maxMyCreeps) {
  const {skills, memory} = configForNewCreep(Memory.config.creeps, this)
  const creeps = this.room.find(FIND_MY_CREEPS);
  const extensions = this.room.find(FIND_STRUCTURES, {
    filter: { structureType: STRUCTURE_EXTENSION }
  });

  if(creeps.length < maxMyCreeps) {
    this.spawnCreep(skills, makeId(), {
      memory: { ...memory },
      energyStructures: [
        ...extensions,
        this
      ]
    });
  }
}
