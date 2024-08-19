const getWalkablePosition = (terrain, nearbyPosition) => {
  return _.filter(nearbyPosition, (position) => {
    let check;
    position.look().forEach(function(lookObject) {
      if(lookObject.type === 'structure') {
          const struct = lookObject.structure.structureType;
          check = struct === STRUCTURE_ROAD
          return
        }
    });
    return terrain.get(position.x, position.y) !== TERRAIN_MASK_WALL || check
  })
}

const getFreePosition = (walkablePosition) => {
    return _.filter(walkablePosition, (position) => !position.lookFor(LOOK_CREEPS).length )
}

const makeId = () => {
  let string = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < Math.floor(Math.random() * (20 - 6) + 6) ) {
    string += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return string
}

const arrayMoveBack = (arr) => {
  const result = []
  for (let i = 1; i < arr.length; i++) {
    result.push(arr[i])
  }
  return [...result, arr[0]]
}

module.exports = {
    getWalkablePosition, getFreePosition, makeId, arrayMoveBack
};
