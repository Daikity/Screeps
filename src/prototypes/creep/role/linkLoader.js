Creep.prototype.uploadLink = function () {
  const linkLoaders = _.filter(Game.creeps, (creep) => creep.memory.role == 'linkLoader')
  const containerLinks = Memory.config.containerLinks

  if(!this.memory.linkObject) {
    if (linkLoaders.length > 0) {
      const freeLinks = _.filter(containerLinks, (links) => {
        return !_.find(linkLoaders, creep => {
          const linkObject = creep.memory.linkObject
          if(linkObject) {
            return linkObject.link === links.link
          }
        })
      })
      this.memory.linkObject = freeLinks[0]
    } else {
      this.memory.linkObject = containerLinks[0]
    }
  }
  return this.memory.linkObject
}


Creep.prototype.transferEnergyToLink = function () {
  const linkObject = this.uploadLink()
  const link = Game.getObjectById(linkObject.link)
  const container = Game.getObjectById(linkObject.container)
  if(this.pos.isNearTo(link) && this.pos.isNearTo(container)) {
    this.withdraw(container, RESOURCE_ENERGY)
    this.transfer(link, RESOURCE_ENERGY)
    return true;
  } else {
    this.moveTo(link);
    return true
  }
  this.memory.working = false;
  return false;
}
