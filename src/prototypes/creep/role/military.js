Creep.prototype.initMilitaryMemory = function() {
  this.memory.homeRoom = this.memory.homeRoom || this.room.name;

  if (!this.memory.adjacentRooms) {
    const adjacentRooms = this.getAdjacentRooms();
    this.memory.adjacentRooms = _.map(adjacentRooms, roomName => {
      const room = Game.rooms[roomName];
      return {
        name: roomName,
        isMy: room && room.controller ? room.controller.my : false
      };
    });
  }
};

Creep.prototype.getAdjacentRooms = function() {
  return [
    this.generateRoomName(0, 1), // Вверх
    this.generateRoomName(0, -1), // Вниз
    this.generateRoomName(1, 0), // Влево
    this.generateRoomName(-1, 0)  // Вправо
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
  const roomCords = this.memory.homeRoom.split('E')[1].split('S')
  const E = Number(roomCords[0])
  const S = Number(roomCords[1])
  return `E${E + x}S${S + y}`;
};

Creep.prototype.military = function() {
  if (!this.memory.homeRoom || !this.memory.adjacentRooms) {
    this.initMilitaryMemory();
  }

  const targetRoom = _.find(this.memory.adjacentRooms, room => !room.isMy);

  if (targetRoom) {
    const exitDir = this.room.findExitTo(targetRoom.name);
    if (exitDir === ERR_NO_PATH) {
      console.log(`Exit to room ${targetRoom.name} is blocked or not found.`);
      return;
    }

    if (this.room.name !== targetRoom.name && !this.memory.work) {
      const exit = this.pos.findClosestByRange(exitDir);
      this.moveTo(exit);
    } else {
      const controller = this.room.controller;
      if (controller) {
        this.memory.work = true
        if (this.claimController(controller) === ERR_NOT_IN_RANGE) {
          this.moveTo(controller);
        } else if (this.claimController(controller) === ERR_GCL_NOT_ENOUGH) {
          console.log("You can't clime room. Your Global Control Level is not enough.")
          Memory.config.military = 0;
          this.suicide();
          return ERR_GCL_NOT_ENOUGH;
        } else if(this.claimController(controller) === ERR_INVALID_TARGET) {
          const tryAttackController = this.attackController(controller)
          if(tryAttackController === ERR_TIRED) {
            this.say('😪')
          }
          if(tryAttackController === OK){
            this.say('😈')
          }
        } else if (this.claimController(controller) === OK) {
          targetRoom.isMy = true;
          this.memory.work = false
        }
      }

    }
  }
};
