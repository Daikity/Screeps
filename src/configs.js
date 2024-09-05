const initialConfigMemory = () => {
  if(!Memory.config) {
    Memory.config = {}
    Memory.config.activeTowers = false
    _.forEach(Game.rooms, room => {
      Memory.config.homeRoom = room
    })
  }
  return true;
}

module.exports = { initialConfigMemory }
