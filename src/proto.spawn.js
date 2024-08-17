StructureSpawn.prototype.activateTowers = function() {
  const towers = this.room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
  _.forEach(towers, tower => tower.defineActions());
}

StructureSpawn.prototype.createBaseCreep = function(maxMyBaseCreeps, skills) {
  let name = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < Math.floor(Math.random() * (20 - 6) + 6) ) {
    name += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  const creeps = this.room.find(FIND_MY_CREEPS);
  if(creeps.length < maxMyBaseCreeps) {
    this.spawnCreep((skills && Array.isArray(skills)) || [WORK, CARRY, MOVE], name);
  }
}
