RoomPosition.prototype.getNearbyPosition = function () {
  const positions = [], startX = this.x || 1, startY = this.y || 1
  for (let x = startX; x <= this.x + 1 && x < 49; x++) {
    for (let y = startY; y <= this.y + 1 && y < 49; y++) {
      if(x !== this.x || y !== this.y) positions.push( new RoomPosition(x, y, this.roomName) )
    }
  }
  return positions
}

RoomPosition.prototype.getOpenPosition = function () {
  const nearbyPosition = this.getNearbyPosition()
  const terrain = Game.map.getRoomTerrain(this.roomName);
  const walkablePosition = _.filter(nearbyPosition, (position) => terrain.get(position.x, position.y) !== TERRAIN_MASK_WALL)
  const freePosition = _.filter(walkablePosition, (position) => !position.lookFor(LOOK_CREEPS).length )
  return freePosition
}
