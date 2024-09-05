Creep.prototype.initMilitaryMemory = function() {
  this.memory.homeRoom = this.memory.homeRoom || this.room.name;

  if (!this.memory.adjacentRooms) {
    const adjacentRooms = this.getAdjacentRooms(this.memory.homeRoom);
    this.memory.adjacentRooms = _.map(adjacentRooms, roomName => {
      const room = Game.rooms[roomName];
      return {
        name: roomName,
        isMy: room && room.controller ? room.controller.my : false
      };
    });
  }
};

Creep.prototype.getAdjacentRooms = function(roomName) {
  const [x, y] = this.parseRoomName(roomName);
  return [
    this.generateRoomName(x, y - 1), // Вверх
    this.generateRoomName(x, y + 1), // Вниз
    this.generateRoomName(x - 1, y), // Влево
    this.generateRoomName(x + 1, y)  // Вправо
  ];
};

Creep.prototype.parseRoomName = function(roomName) {
  const [, hor, vert] = roomName.match(/([WE])(\d+)([NS])(\d+)/);
  return [
    hor === 'W' ? -parseInt(vert, 10) : parseInt(vert, 10),
    vert === 'S' ? -parseInt(vert, 10) : parseInt(vert, 10)
  ];
};

Creep.prototype.generateRoomName = function(x, y) {
  const horizontal = x < 0 ? `W${-x}` : `E${x}`;
  const vertical = y < 0 ? `S${-y}` : `N${y}`;
  return `${horizontal}${vertical}`;
};

Creep.prototype.military = function() {
  if (!this.memory.homeRoom || !this.memory.adjacentRooms) this.initMilitaryMemory();

  const targetRoom = _.find(this.memory.adjacentRooms, room => !room.isMy);

  if (targetRoom) {
    const exitDir = this.room.findExitTo(targetRoom.name);
    if (exitDir === ERR_NO_PATH) return console.log(`Exit to room ${targetRoom.name} is blocked or not found.`);

    this.room.name !== targetRoom.name
      ? this.moveTo(this.pos.findClosestByRange(exitDir))
      : this.room.controller && this.claimController(this.room.controller) === ERR_NOT_IN_RANGE
      ? this.moveTo(this.room.controller)
      : this.claimController(this.room.controller) === OK
      ? targetRoom.isMy = true
      : null;
  }
};
