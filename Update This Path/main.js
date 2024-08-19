/* This header is placed at the beginning of the output file and defines the
	special `__require`, `__getFilename`, and `__getDirname` functions.
*/
(function() {
	/* __modules is an Array of functions; each function is a module added
		to the project */
var __modules = {},
	/* __modulesCache is an Array of cached modules, much like
		`require.cache`.  Once a module is executed, it is cached. */
	__modulesCache = {},
	/* __moduleIsCached - an Array of booleans, `true` if module is cached. */
	__moduleIsCached = {};
/* If the module with the specified `uid` is cached, return it;
	otherwise, execute and cache it first. */
function __require(uid, parentUid) {
	if(!__moduleIsCached[uid]) {
		// Populate the cache initially with an empty `exports` Object
		__modulesCache[uid] = {"exports": {}, "loaded": false};
		__moduleIsCached[uid] = true;
		if(uid === 0 && typeof require === "function") {
			require.main = __modulesCache[0];
		} else {
			__modulesCache[uid].parent = __modulesCache[parentUid];
		}
		/* Note: if this module requires itself, or if its depenedencies
			require it, they will only see an empty Object for now */
		// Now load the module
		__modules[uid].call(this, __modulesCache[uid], __modulesCache[uid].exports);
		__modulesCache[uid].loaded = true;
	}
	return __modulesCache[uid].exports;
}
/* This function is the replacement for all `__filename` references within a
	project file.  The idea is to return the correct `__filename` as if the
	file was not concatenated at all.  Therefore, we should return the
	filename relative to the output file's path.

	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getFilename(path) {
	return require("path").resolve(__dirname + "/" + path);
}
/* Same deal as __getFilename.
	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getDirname(path) {
	return require("path").resolve(__dirname + "/" + path + "/../");
}
/********** End of header **********/
/********** Start module 0: /Users/igoredison/Documents/projects/screeps/src/main.js **********/
__modules[0] = function(module, exports) {
__require(1,0)
__require(2,0)
__require(3,0)
__require(4,0)

module.exports.loop = function () {
  for(let i in Memory.creeps) {
    if(!Game.creeps[i]) {
      delete Memory.creeps[i];
    }
  }

  let MAX_BASE_CREEPS = Memory.max_creep_in_room || 6
  if (Memory.config.creeps) {
    MAX_BASE_CREEPS = 0;
    for(let i in Memory.config.creeps) { MAX_BASE_CREEPS += Memory.config.creeps[i] }
  }

  _.forEach(Game.rooms, room => {
    const spawns = room.find(FIND_MY_SPAWNS)
    _.forEach(spawns, spawn => {
      spawn.activateTowers(Memory.activeTowers)
      spawn.createNewCreep(MAX_BASE_CREEPS)
    })
  })

  for(let name in Game.creeps) {
    const creep = Game.creeps[name];
    creep.run(Memory.config.creeps);
  }
}

return module.exports;
}
/********** End of module 0: /Users/igoredison/Documents/projects/screeps/src/main.js **********/
/********** Start module 1: /Users/igoredison/Documents/projects/screeps/src/proto.room.position.js **********/
__modules[1] = function(module, exports) {
const { getWalkablePosition, getFreePosition } = __require(5,1)

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

return module.exports;
}
/********** End of module 1: /Users/igoredison/Documents/projects/screeps/src/proto.room.position.js **********/
/********** Start module 2: /Users/igoredison/Documents/projects/screeps/src/proto.creep.js **********/
__modules[2] = function(module, exports) {
const { arrayMoveBack } = __require(5,2)
Creep.prototype.fineEnergySource = function () {
  const sources = this.room.find(FIND_SOURCES)
  if(sources.length) {
    if(!Memory.sources) {
      Memory.sources = []
      _.forEach(sources, source => {
        Memory.sources.push(source.id)
      })
    }
    const source = _.find(sources, (s) => s.pos.getOpenPosition().length > 0)
    if(source) this.memory.source = source.id
    return sources
  }
}

Creep.prototype.harvestSources = function () {
  const source = Game.getObjectById(this.memory.source)

  if(this.store.getFreeCapacity() > 0 && !this.memory.working) {
    if(!source || (!source.pos.getOpenPosition().length > 0 && !this.pos.isNearTo(source))) {
      if(source && Memory.sources) {
        _.forEach(Memory.sources, src => {
          let sources = Memory.sources
          if(src === this.memory.source) {
            this.memory.source = arrayMoveBack(sources)[0]
            return;
          }
          sources = arrayMoveBack(sources)
        })
      } else {
        delete this.memory.source
        this.fineEnergySource()
      }
    }
    if(source) {
        const danger = source.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        if(danger.length > 0) {
          this.say('OMG!😨');
          if(Memory.sources) {
            _.forEach(Memory.sources, src => {
              let sources = Memory.sources
              if(src === this.memory.source) {
                this.memory.source = arrayMoveBack(sources)[0]
                return;
              }
              sources = arrayMoveBack(sources)
            })
          } else {
            delete this.memory.source
            this.fineEnergySource()
          }
        }
    }
    source && this.pos.isNearTo(source) ? this.harvest(source) : this.moveTo(source)
    return false
  }
  this.memory.isHarvest = false
  return true
}

Creep.prototype.transferSource = function () {
  const targets = this.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return (
        structure.structureType == STRUCTURE_EXTENSION ||
        structure.structureType == STRUCTURE_SPAWN ||
        structure.structureType == STRUCTURE_TOWER ||
        structure.structureType == STRUCTURE_CONTAINER ) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
  if(targets.length > 0) {
    if(this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.moveTo(targets[0]);
    } else this.memory.working = false;
    return true;
  }
  this.memory.working = false;
  return false;
}

Creep.prototype.upgradingController = function () {
  if(this.memory.working && this.store[RESOURCE_ENERGY] == 0) {
    this.memory.working = false;
  }
  if(!this.memory.working && this.store.getFreeCapacity() == 0) {
    this.memory.working = true;
  }

  if(this.memory.working && !this.memory.building) {
    if(this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
      this.moveTo(this.room.controller);
    }
  }
}

Creep.prototype.buildingController = function () {
  if(this.memory.working && this.store[RESOURCE_ENERGY] == 0) {
    this.memory.working = false;
    this.memory.building = false;
  }
  if(!this.memory.working && this.store.getFreeCapacity() == 0) {
    this.memory.working = true;
    this.memory.building = true;
  }

  if(this.memory.working) {
    const targets = this.room.find(FIND_CONSTRUCTION_SITES);
    if(targets.length) {
      if(this.build(targets[0]) == ERR_NOT_IN_RANGE) {
        this.moveTo(targets[0]);
      }
      return true
    }
  }
  this.memory.building = false;
  return false
}

Creep.prototype.run = function (memoryCreep) {
  const storageIsFull = this.memory.isHarvest ? this.harvestSources() : true;

  const MIN_CREEPS_OF_ONE_TYPE = 3;
  const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
  const upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length;
  const builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;

  if(!Boolean(this.memory.role)) {
    this.memory.working = false;
    this.memory.isHarvest = false;
    switch (true) {
      case (memoryCreep && memoryCreep.harvesters < harvesters) || harvesters < MIN_CREEPS_OF_ONE_TYPE:
        this.memory.role = 'harvester'
        break;
      case (memoryCreep && memoryCreep.upgrader < upgrader) || upgrader < MIN_CREEPS_OF_ONE_TYPE:
        this.memory.role = 'upgrader'
        break;
      case (memoryCreep && memoryCreep.builder < builder) || builder < MIN_CREEPS_OF_ONE_TYPE:
        this.memory.role = 'builder'
        break;
      default:
        this.memory.role = 'harvester'
        break;
    }
  }

  if (this.store.getUsedCapacity() === 0) {
    this.memory.isHarvest = true
  }

  switch (true) {
    case storageIsFull && this.memory.role === 'harvester' && this.transferSource():
      break;
    case storageIsFull && this.memory.role === 'builder' && (this.buildingController() || this.transferSource()):
      break;
    default:
      if (storageIsFull) {
        this.memory.working = true;
        this.upgradingController()
      }
      break;
  }
}

return module.exports;
}
/********** End of module 2: /Users/igoredison/Documents/projects/screeps/src/proto.creep.js **********/
/********** Start module 3: /Users/igoredison/Documents/projects/screeps/src/proto.tower.js **********/
__modules[3] = function(module, exports) {
StructureTower.prototype.defineActions = function () {
  const enemyCreeps = this.room.find(FIND_HOSTILE_CREEPS);
  if(enemyCreeps.length) {
    this.attack(enemyCreeps[0]);
  } else {
    const damagedStructures = this.room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL
    });

    const damagedCreeps = this.room.find(FIND_MY_CREEPS, {
      filter: (creep) => creep.hits < creep.hitsMax
    });

    if(damagedStructures.length) {
      this.repair(damagedStructures[0]);
    }

    if(damagedCreeps.length) {
      this.heal(damagedCreeps[0]);
    }
  }
}

return module.exports;
}
/********** End of module 3: /Users/igoredison/Documents/projects/screeps/src/proto.tower.js **********/
/********** Start module 4: /Users/igoredison/Documents/projects/screeps/src/proto.spawn.js **********/
__modules[4] = function(module, exports) {
const { makeId } = __require(5,4)

StructureSpawn.prototype.activateTowers = function(isActive) {
  const towers = this.room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
  if(isActive){
    _.forEach(towers, tower => tower.defineActions());
  }
}

StructureSpawn.prototype.createNewCreep = function(maxMyCreeps, skills) {
  const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;

  const uploadSkills = []
  const getSkills = Boolean(skills && Array.isArray(skills) && harvesters > 0) ? skills : [WORK, CARRY, MOVE]
  const totalEnergy = this.room.energyAvailable
  const skillsCost = _.sum(getSkills, s => BODYPART_COST[s])
  const maxSkills = totalEnergy / skillsCost;

  _.times(maxSkills, () => {
    _.forEach(getSkills, (s) => uploadSkills.push(s))
  })

  const creeps = this.room.find(FIND_MY_CREEPS);
  if(creeps.length < maxMyCreeps) {
    this.spawnCreep(uploadSkills, makeId());
  }
}

return module.exports;
}
/********** End of module 4: /Users/igoredison/Documents/projects/screeps/src/proto.spawn.js **********/
/********** Start module 5: /Users/igoredison/Documents/projects/screeps/src/libs.js **********/
__modules[5] = function(module, exports) {
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

return module.exports;
}
/********** End of module 5: /Users/igoredison/Documents/projects/screeps/src/libs.js **********/
/********** Footer **********/
if(typeof module === "object")
	module.exports = __require(0);
else
	return __require(0);
})();
/********** End of footer **********/
