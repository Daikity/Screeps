Creep.prototype.solder = function() {
  if (!this.memory.homeRoom || !this.memory.adjacentRooms) {
    this.initMilitaryMemory();
  }

  const targetRoom = _.find(this.memory.adjacentRooms, room => !room.isMy);

  if (targetRoom) {
    const exitDir = this.room.findExitTo(targetRoom.name);
    if (exitDir === ERR_NO_PATH) {
      console.log(`Exit to room ${targetRoom.name} is blocked or not found.`);
      return;
    }

    if (this.room.name !== targetRoom.name && !this.memory.work) {
      const exit = this.pos.findClosestByRange(exitDir);
      this.moveTo(exit);
    } else {
      const hostileStructures = this.room.find(FIND_HOSTILE_STRUCTURES, {
        filter: structure => structure.structureType === STRUCTURE_TOWER || structure.structureType === STRUCTURE_SPAWN
      });
      const hostiles = this.room.find(FIND_HOSTILE_CREEPS);

      const targetEnemy = _.sortBy([].concat(hostiles || [], hostileStructures || []), target => this.pos.getRangeTo(target.pos))

      this.memory.work = true
      if (targetEnemy.length) {
        const target = this.pos.findClosestByRange(targetEnemy);
        const tryAttack = this.attack(target)
        if (tryAttack !== OK) {
          this.moveTo(target)
        }
      } else {
        this.memory.work = false
      }
    }
  }
};
