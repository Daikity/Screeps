const checkRequiredMemoryData = () => {
  const containersInRoom = [], linksInRoom = [], miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner').length;
  let constructionSites;
  let enemies = 0
  let homeRoom = null
  _.forEach(Game.rooms, room => {
    const containers = room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
    })
    constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    const links = room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_LINK
    })
    enemies = room.find(FIND_HOSTILE_CREEPS);
    homeRoom = room
    linksInRoom.push(...links)
    containersInRoom.push(...containers);
  })


  if(!Memory.config) {
    Memory.config = {}
    Memory.config.creeps = {
      harvesters: 3,
      upgraders: 3,
      builders: 3,
      miners: 0,
      linkLoaders: 0,
      heelers: 0,
      military: 0,
      defenders: 0,
      deliverymans: 0,
    }
    Memory.config.activeTowers = false
  }
  if(Memory.config && miners !== containersInRoom.length) {
    Memory.config.creeps.miners = containersInRoom.length
  }
  if(Memory.config && linksInRoom.length === 2) {
    Memory.config.creeps.linkLoaders = 1
  }
  if(enemies.length > 0) {
    homeRoom.controller.activateSafeMode();
    Memory.config.creeps.defenders = enemies.length * 2
    Memory.config.activeTowers = true
  } else {
    Memory.config.creeps.defenders = 0
  }

  Memory.config.creeps.builders = constructionSites.length > 0 ? (constructionSites.length > 4 ? 4 : constructionSites.length) : 0

  return true
}

const configForNewCreep = (memoryCreep, spawn) => {
  // add role if not found in memory
  const miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner').length;
  const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
  const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length;
  const builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;
  const heelers = _.filter(Game.creeps, (creep) => creep.memory.role == 'heeler').length;
  const defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender').length;
  const military = _.filter(Game.creeps, (creep) => creep.memory.role == 'military').length;
  const deliverymans = _.filter(Game.creeps, (creep) => creep.memory.role == 'deliveryman').length;
  const linkLoaders = _.filter(Game.creeps, (creep) => creep.memory.role == 'linkLoader').length;

  let skills, role;

  switch (true) {
    case memoryCreep && memoryCreep.harvesters > harvesters:
      role = 'harvester'
      skills = [WORK, CARRY, MOVE]
      break;
    case memoryCreep && memoryCreep.upgraders > upgraders:
      role = 'upgrader'
      skills = [WORK, CARRY, MOVE]
      break;
    case memoryCreep && memoryCreep.builders > builders:
      role = 'builder'
      skills = [WORK, CARRY, MOVE]
      break;
    case memoryCreep && memoryCreep.defenders > defenders:
      role = 'defender'
      skills = [TOUGH, ATTACK, RANGED_ATTACK, MOVE]
      break;
    case memoryCreep && memoryCreep.military > military:
      role = 'military'
      skills = [TOUGH, ATTACK, RANGED_ATTACK, MOVE]
      break;
    case memoryCreep && memoryCreep.heelers > heelers:
      role = 'heeler'
      skills = [TOUGH, HEAL, MOVE]
      break;
    case memoryCreep && memoryCreep.miners > miners:
      role = 'miner'
      skills = [WORK, WORK, MOVE]
      break;
    case memoryCreep && memoryCreep.deliverymans > deliverymans:
      role = 'deliveryman'
      skills = [CARRY, CARRY, CARRY, MOVE]
      break;
    case memoryCreep && memoryCreep.linkLoaders > linkLoaders:
      role = 'linkLoader'
      skills = [CARRY, CARRY, CARRY, MOVE]
      break;
    default:
      role = 'harvester'
      skills = [WORK, CARRY, MOVE]
      break;
  }

  const uploadSkills = []
  const totalEnergy = spawn.room.energyAvailable
  const skillsCost = _.sum(skills, s => BODYPART_COST[s])
  const maxSkills = Math.floor(totalEnergy / skillsCost)

  _.times(maxSkills, () => {
    _.forEach(skills, (s) => uploadSkills.push(s))
  })

  return {
    skills: uploadSkills,
    memory: {
      role: role,
      working: false,
      isHarvest: false
    }
  }
}

const initialLinks = (room) => {
  const storage = room.storage

  const containers = room.find(FIND_STRUCTURES, {
    filter: (structure) => structure.structureType === STRUCTURE_CONTAINER
  });

  const links = room.find(FIND_STRUCTURES, {
    filter: (structure) => structure.structureType === STRUCTURE_LINK
  });

  if (links.length >= 1) {
    if (storage) {
      const storageLink = _.find(links, (link) => link.pos.isNearTo(storage));
      if (storageLink) {
        Memory.config.storageLink = storageLink.id
      }
    }
  }

  const containerLinks = []
  const sources = room.find(FIND_SOURCES)
  if (sources.length > 0 && containers.length > 0) {
    _.forEach(sources, source => {
      const container = _.find(containers, container => container.pos.isNearTo(source))
      if (container) {
        const link = _.find(links, link => link.pos.isNearTo(container))
        if (link) {
          containerLinks.push({
            container: container.id,
            link: link.id,
            source: source.id
          })
        }
      }
    })
    Memory.config.containerLinks = containerLinks
  }

  if(storage) {
    const storageLink = _.find(links, (link) => link.pos.isNearTo(storage));
    if(storageLink && links) {
      _.forEach(links, link => {
        link.transferEnergy(storageLink, link.store.getUsedCapacity())
      })
    }
  }
}

module.exports = { initialLinks, checkRequiredMemoryData, configForNewCreep }
