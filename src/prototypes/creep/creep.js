const { arrayMoveBack } = require('../../libs')
require('./role')

Creep.prototype.addSourceId = function () {
  const source = Game.getObjectById(this.memory.source)
  if(source && Memory.sources) {
    let sources = Memory.sources[this.room.name]
    _.forEach(Memory.sources[this.room.name], src => {
      if(src === this.memory.source) {
        this.memory.source = arrayMoveBack(sources)[0]
        return;
      }
      sources = arrayMoveBack(sources)
    })
  } else {
    delete this.memory.source
    this.fineEnergySource()
  }
}

Creep.prototype.run = function () {
  const storageIsFull = this.memory.isHarvest ? this.harvestSources() : true;
  const role = this.memory.role

  if (this.store.getUsedCapacity() === 0) {
    this.memory.isHarvest = true
  }

  switch (true) {
    case storageIsFull && role === 'harvester' && this.transferSource():
      break;
    case storageIsFull && role === 'builder' && (this.buildingController() || this.transferSource()):
      break;
    case storageIsFull && role === 'miner' && this.mineSource():
      break;
    case storageIsFull && role === 'upgrader' && this.upgradingController():
      break;
    case storageIsFull && role === 'deliveryman' && this.transferToStorage():
      break;
    default:
      if (!this.memory.isHarvest && !this.memory.working) {
        let mySpawn = null
        _.forEach(Game.rooms, room => {
          const spawns = room.find(FIND_MY_SPAWNS)
          _.forEach(spawns, spawn => {
            mySpawn = spawn
          })
        })
        if (Boolean(mySpawn)) {
          const spawnPos = mySpawn.pos
          const path = new RoomPosition(spawnPos.x - 3, spawnPos.y + 3, this.room.name)
          if (!this.pos.isEqualTo(path)) {
            this.moveTo(path)
          }
        }
      }
      break;
  }
}
