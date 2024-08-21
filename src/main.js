require('./prototypes')
const { checkRequiredMemoryData } = require('./configs')

module.exports.loop = function () {
  for(let i in Memory.creeps) {
    if(!Game.creeps[i]) {
      delete Memory.creeps[i];
    }
  }

  if (checkRequiredMemoryData()) {
    let MAX_BASE_CREEPS = 0;
    for(let i in Memory.config.creeps) { MAX_BASE_CREEPS += Memory.config.creeps[i] }

    _.forEach(Game.rooms, room => {
      const spawns = room.find(FIND_MY_SPAWNS)
      _.forEach(spawns, spawn => {
        spawn.killCreeps(Memory.config.creeps)
        spawn.activateTowers(Memory.config.activeTowers)
        spawn.createNewCreep(MAX_BASE_CREEPS)
      })
    })

    for(let name in Game.creeps) {
      const creep = Game.creeps[name];
      creep.run();
    }
  }
}
