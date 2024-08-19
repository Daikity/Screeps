const { makeId } = require('../../libs')

StructureSpawn.prototype.activateTowers = function(isActive) {
  const towers = this.room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
  if(isActive){
    _.forEach(towers, tower => tower.defineActions());
  }
}

StructureSpawn.prototype.createNewCreep = function(maxMyCreeps, skills) {
  const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;

  const uploadSkills = []
  const getSkills = Boolean(skills && Array.isArray(skills) && harvesters > 0) ? skills : [WORK, CARRY, MOVE]
  const totalEnergy = this.room.energyAvailable
  const skillsCost = _.sum(getSkills, s => BODYPART_COST[s])
  const maxSkills = totalEnergy / skillsCost;

  _.times(maxSkills, () => {
    _.forEach(getSkills, (s) => uploadSkills.push(s))
  })

  const creeps = this.room.find(FIND_MY_CREEPS);
  if(creeps.length < maxMyCreeps) {
    this.spawnCreep(uploadSkills, makeId());
  }
}
