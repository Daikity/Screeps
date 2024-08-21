const { getWalkablePosition, getFreePosition } = require('../../libs')

RoomPosition.prototype.getNearbyPosition = function () {
  const positions = [], startX = this.x || 1, startY = this.y || 1

  positions.push(new RoomPosition(startX - 1, startY, this.roomName));
  positions.push(new RoomPosition(startX + 1, startY, this.roomName));
  positions.push(new RoomPosition(startX, startY - 1, this.roomName));
  positions.push(new RoomPosition(startX, startY + 1, this.roomName));

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i != 0 || j != 0) {
        positions.push(new RoomPosition(startX + i, startY + j, this.roomName));
      }
    }
  }

  return positions
}

RoomPosition.prototype.getPositionForContainer = function () {
  const nearPosition = this.getNearbyPosition()

  const findContainersAroundSource = _.find(nearPosition, position => {
    const found = position.lookFor(LOOK_STRUCTURES);
    if(found.length > 0) {
      if (found[0].structureType === STRUCTURE_CONTAINER) {
        return position
      }
    }
    return false
  })
  if (findContainersAroundSource) {
    return findContainersAroundSource
  }
  return false
}

RoomPosition.prototype.getOpenPositionForContainer = function () {
  if (!this.lookFor(LOOK_CREEPS).length) {
    return this
  }
  return false
}

RoomPosition.prototype.getOpenPosition = function () {
  const nearbyPosition = this.getNearbyPosition()
  const terrain = Game.map.getRoomTerrain(this.roomName);
  const walkablePosition = getWalkablePosition(terrain, nearbyPosition, TERRAIN_MASK_WALL)
  const freePosition = getFreePosition(walkablePosition)

  return freePosition
}
