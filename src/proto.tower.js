StructureTower.prototype.defineActions = function () {
  const enemyCreeps = this.room.find(FIND_HOSTILE_CREEPS);
  if(enemyCreeps.length) {
    this.attack(enemyCreeps[0]);
  } else {
    const damagedStructures = this.room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL
    });

    const damagedCreeps = this.room.find(FIND_MY_CREEPS, {
      filter: (creep) => creep.hits < creep.hitsMax
    });

    if(damagedStructures.length) {
      this.repair(damagedStructures[0]);
    }

    if(damagedCreeps.length) {
      this.heal(damagedCreeps[0]);
    }
  }
}
