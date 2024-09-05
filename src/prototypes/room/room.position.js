RoomPosition.prototype.findOpenSource = function(resourceType) {
  const source = this.findClosestByPath(FIND_SOURCES, {
    filter: (s) => !s.pos.lookFor(LOOK_CREEPS).length &&
      !this.findInRange(FIND_HOSTILE_CREEPS, 5).length
  });

  if(source) {
    return source;
  }
  return
};
