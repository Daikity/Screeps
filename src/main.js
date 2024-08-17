require('./proto.room.position')
require('./proto.creep')
require('./proto.tower')
require('./proto.spawn')

module.exports.loop = function () {
  const SPAWN = Game.spawns['Home']
  for(let i in Memory.creeps) {
    if(!Game.creeps[i]) {
      delete Memory.creeps[i];
    }
  }

  SPAWN.activateTowers()
  SPAWN.createBaseCreep(9)

  for(let name in Game.creeps) {
    const creep = Game.creeps[name];
    creep.run();
  }
}

