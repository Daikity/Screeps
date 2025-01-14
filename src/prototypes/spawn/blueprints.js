StructureSpawn.prototype.creepBlueprints = {
  harvester: [
    { cost: 200, body: [WORK, CARRY, MOVE] },
    { cost: 300, body: [WORK, WORK, CARRY, MOVE] },
    { cost: 400, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE] },
    { cost: 550, body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE] }
  ],
  upgrader: [
    { cost: 200, body: [WORK, CARRY, MOVE] },
    { cost: 300, body: [WORK, WORK, CARRY, MOVE] },
    { cost: 400, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE] },
    { cost: 550, body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE] }
  ],
  builder: [
    { cost: 200, body: [WORK, CARRY, MOVE] },
    { cost: 300, body: [WORK, WORK, CARRY, MOVE] },
    { cost: 400, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE] },
    { cost: 550, body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE] }
  ],
  repairer: [
    { cost: 200, body: [WORK, CARRY, MOVE] },
    { cost: 300, body: [WORK, WORK, CARRY, MOVE] },
    { cost: 400, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE] },
    { cost: 550, body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE] }
  ],
  defender: [
    { cost: 200, body: [TOUGH, ATTACK, MOVE] },
    { cost: 300, body: [TOUGH, TOUGH, ATTACK, MOVE, MOVE] },
    { cost: 400, body: [TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE] },
    { cost: 550, body: [TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE, MOVE] }
  ],
  solder: [
    { cost: 450, body: [TOUGH, TOUGH, TOUGH, ATTACK, RANGED_ATTACK, ATTACK, MOVE, MOVE] },
    { cost: 550, body: [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, RANGED_ATTACK, ATTACK, MOVE, MOVE] },
    { cost: 650, body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE] },
  ],
  miner: [
    { cost: 300, body: [WORK, CARRY, MOVE] }, // Минимум 300 энергии для двух WORK
    { cost: 550, body: [WORK, WORK, CARRY, MOVE] }
  ],
  mineralMiner: [
    { cost: 300, body: [WORK, CARRY, MOVE] }, // Минимум 300 энергии для двух WORK
    { cost: 550, body: [WORK, WORK, CARRY, MOVE] }
  ],
  military: [
    { cost: 650, body: [CLAIM, MOVE] },
    { cost: 1300, body: [CLAIM, CLAIM, MOVE, MOVE] }
  ]
};

// Определение целевых значений для крипов
StructureSpawn.prototype.determineTargetCreepCount = function() {
  const room = this.room;

  const sources = room.find(FIND_SOURCES);
  const storage = room.storage;
  const containers = room.find(FIND_STRUCTURES, {
      filter: structure => structure.structureType === STRUCTURE_CONTAINER
  });
  const links = room.find(FIND_STRUCTURES, {
      filter: structure => structure.structureType === STRUCTURE_LINK
  });
  const extractor = this.room.find(FIND_STRUCTURES, {
    filter: (structure) => structure.structureType === STRUCTURE_EXTRACTOR
  })[0]

  const totalStored = (storage ? storage.store[RESOURCE_ENERGY] : 0) +
                      _.sum(containers, container => container.store[RESOURCE_ENERGY]) +
                      _.sum(links, link => link.store[RESOURCE_ENERGY]);

  const numSources = sources.length;
  const minHarvesterCount = numSources;
  const energyPerHarvester = 1000;
  const targetHarvesterCount = Math.max(minHarvesterCount, Math.ceil(totalStored / energyPerHarvester));

  const countStructure = _.size(room.find(FIND_CONSTRUCTION_SITES))
  const targetBuilderCount = countStructure > 3 ? 3 : 1;

  const countDamageStructures = this.room.find(FIND_STRUCTURES, {
    filter: object => object.hits < object.hitsMax
  }).length
  const countEnemy = this.room.find(FIND_HOSTILE_CREEPS).length;

  return {
    harvester: targetHarvesterCount > 100 ? 3 : 5,
    upgrader: 4,
    builder: countStructure > 0 ? targetBuilderCount : 0,
    miner: _.size(containers),
    repairer: countDamageStructures > 0 ? 2 : 0,
    military: Memory.config.military ? Memory.config.military : 0,
    solder: Memory.config.solder ? Memory.config.solder : 0,
    mineralMiner: extractor ? 1 : 0,
    defender: countEnemy > 0 ? countEnemy + 1 : 0
  };
};
