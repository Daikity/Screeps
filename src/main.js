require('./prototypes')

module.exports.loop = function () {
  for(let i in Memory.creeps) {
    if(!Game.creeps[i]) {
      delete Memory.creeps[i];
    }
  }

  let MAX_BASE_CREEPS = Memory.max_creep_in_room || 6
  if (Memory.config.creeps) {
    MAX_BASE_CREEPS = 0;
    for(let i in Memory.config.creeps) { MAX_BASE_CREEPS += Memory.config.creeps[i] }
  }

  _.forEach(Game.rooms, room => {
    const spawns = room.find(FIND_MY_SPAWNS)
    _.forEach(spawns, spawn => {
      spawn.activateTowers(Memory.activeTowers)
      spawn.createNewCreep(MAX_BASE_CREEPS)
    })
  })

  for(let name in Game.creeps) {
    const creep = Game.creeps[name];
    creep.run(Memory.config.creeps);
  }
}
