const { makeId } = require('../../libs')

StructureSpawn.prototype.activateTowers = function(isActive) {
  const towers = this.room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
  if(isActive){
    _.forEach(towers, tower => tower.defineActions());
  }
}

StructureSpawn.prototype.createCreepByRole = function (role) {
  const availableEnergy = this.room.energyAvailable;
  const blueprints = this.creepBlueprints[role];

  if (!blueprints) {
      Memory.debug ? console.log(`No blueprints found for role: ${role}`) : null;
      return ERR_INVALID_ARGS;
  }

  const blueprint = _.findLast(blueprints, bp => bp.cost <= availableEnergy);

  if (blueprint) {
      const newName = `${role}_${makeId()}`;
      const result = this.spawnCreep(blueprint.body, newName, { memory: { role: role } });

      if (result === OK) {
          Memory.debug ? console.log(`Spawned new ${role}: ${newName}`) : null;
          return newName;
      } else {
          Memory.debug ? console.log(`Failed to spawn ${role}: ${result}`) : null;
          return result;
      }
  } else {
      Memory.debug ? console.log(`Not enough energy to spawn ${role}. Required: ${blueprints[0].cost}, Available: ${availableEnergy}`) : null;
      return ERR_NOT_ENOUGH_ENERGY;
  }
};
