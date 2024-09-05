require('./prototypes')
const { initialConfigMemory } = require('./configs')

module.exports.loop = function () {
  for(let i in Memory.creeps) {
    if(!Game.creeps[i]) {
      delete Memory.creeps[i];
    }
  }

  _.forEach(Game.creeps, creep => {
    if (creep.memory.role) {
      if (typeof creep[creep.memory.role] === 'function') {
        creep[creep.memory.role]();
      }
    }
  })

  if (initialConfigMemory()) {
    _.forEach(Game.rooms, room => {
      const spawns = room.find(FIND_MY_SPAWNS)
      _.forEach(spawns, spawn => {
        spawn.activateTowers(Memory.config.activeTowers)
        spawn.manageCreepPopulation()
      })
    })
  }
}
