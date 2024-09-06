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

const uploadEnergyLink = (room) => {
  const storage = room.storage
  if(!storage) {
    if(Memory.debug) {
      console.log(`Storage not found for ${room}`)
    }
    return undefined
  }
  const fromLink = room.find(FIND_STRUCTURES, {
    filter: (structure) => structure.pos.isNearTo(storage) && structure.structureType === STRUCTURE_LINK
  })[0];

  if (!fromLink) {
    return fromLink
  }

  const toLink = room.find(FIND_STRUCTURES, {
    filter: (structure) => !structure.pos.isEqualTo(fromLink.pos) && structure.structureType === STRUCTURE_LINK
  });

  if (!fromLink || !toLink) {
    return undefined
  }

  if(toLink.length > 0) {
    _.forEach(toLink, link => {
      link.transferEnergy(fromLink);
      if(Memory.debug) {
        console.log(`Energy transferred from ${fromLink.pos} to ${link.pos}`)
      }
    })
  }
}

module.exports = { initialConfigMemory, uploadEnergyLink }
