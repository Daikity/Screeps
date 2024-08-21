Creep.prototype.mineSource = function () {
  const source = Game.getObjectById(this.memory.source)

  if(!this.memory.working) {
    if (source) {
      const positionForContainer = source.pos.getPositionForContainer()
      if (!positionForContainer) {
        this.say('Hmm..!🧐')
        this.addSourceId()
        return false
      }

      const openPositionForContainer = positionForContainer.getOpenPositionForContainer()

      const danger = source.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
      if(danger.length > 0) {
        this.say('OMG!😨')
        this.addSourceId()
        return false
      }
      if (openPositionForContainer) {
        if(!this.pos.isNearTo(source)) {
          this.moveTo(openPositionForContainer)
        }
      } else if (this.pos.isEqualTo(positionForContainer)) {
        if(this.pos.isNearTo(source)) {
          this.harvest(source)
        }
      } else {
        this.addSourceId()
        return false
      }
    } else {
      this.addSourceId()
      return false
    }
  }
  this.memory.isHarvest = false
  return true
}
