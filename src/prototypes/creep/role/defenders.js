Creep.prototype.defender = function() {
  const enemies = _.sortBy(this.room.find(FIND_HOSTILE_CREEPS), enemy => this.pos.getRangeTo(enemy.pos))
  if(enemies.length > 0) {
    this.pos.isNearTo(enemies[0]) ? this.attack(enemies[0]) : this.moveTo(enemies[0])
  } else {
    console.log('All enemies is dead');
    this.say('😈');
    this.suicide();
  }
}
