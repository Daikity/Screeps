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

RoomPosition.prototype.getOpenPosition = function () {
  const nearbyPosition = this.getNearbyPosition()
  const terrain = Game.map.getRoomTerrain(this.roomName);
  const walkablePosition = getWalkablePosition(terrain, nearbyPosition)
  const freePosition = getFreePosition(walkablePosition)

  return freePosition
}
