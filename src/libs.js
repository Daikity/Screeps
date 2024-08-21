/**
import { object } from '../node_modules/matchdep/lib/matchdep';
 * Returns the free position
 * @param {RoomTerrain} terrain
 * @param {RoomPosition} nearbyPosition
 * @returns {RoomPosition} available positions around the resource
 */
const getWalkablePosition = (terrain, nearbyPosition, object) => {
  return _.filter(nearbyPosition, (position) => {
    const isRoad = position.look().forEach(function(lookObject) {
      if(lookObject.type === LOOK_STRUCTURES) {
          return lookObject.structure.structureType === STRUCTURE_ROAD
        }
    });
    return terrain.get(position.x, position.y) !== object || isRoad
  })
}

/**
 * Returns the free position
 * @param {RoomPosition} walkablePosition available positions around the resource
 * @returns {RoomPosition} free positions around the resource
 */
const getFreePosition = (walkablePosition) => {
  return _.filter(walkablePosition, (position) => !position.lookFor(LOOK_CREEPS).length )
}

/**
 * Create random string
 * @returns random string
 */
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

/**
 * Move the last index to the beginning
 * @param {Array} arr any array
 * @returns {Array} new array
 */
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
