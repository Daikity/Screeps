Creep.prototype.defendRoom = function() {
  const enemies = this.room.find(FIND_HOSTILE_CREEPS);

  if(enemies.length > 0) {
    this.pos.isNearTo(enemies[0]) ? this.attack(enemies[0]) : this.moveTo(enemies[0])
    return true;
  }
  this.memory.working = false;
  return false;
}
