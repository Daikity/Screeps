const checkRequiredMemoryData = () => {
  if(!Memory.config) {
    Memory.config = {}
    Memory.config.creeps = {
      harvesters: 3,
      upgraders: 3,
      builders: 3,
      miners: 0,
      heelers: 0,
      military: 0,
      defenders: 0,
      deliverymans: 0,
    }
    Memory.config.activeTowers = true
  }
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

module.exports = { checkRequiredMemoryData, configForNewCreep }
