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

  _.forEach(needRoles, role => {
    const creeps = _.filter(Game.creeps, creep => !creep.memory.role || creep.memory.role === String(role).slice(0, -1))
    if (creeps.length > 0) {
      creeps[0].suicide();
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
JSON.stringify
