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
  const containers = []

  if(Memory.sources) {
    for (const room in Memory.sources) {
      if (Game.rooms[room]) {
        const containersInRoom = Game.rooms[room].find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
      })
      containers.push(...containersInRoom)
      }
    }
  }

  const findContainersAroundSource = _.find(nearPosition, position => {
    return _.find(containers, container => container.pos.isEqualTo(position)) || false;
  })
  return findContainersAroundSource || false
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
