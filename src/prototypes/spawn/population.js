// Метод для подсчета крипов по роли
StructureSpawn.prototype.countCreepsByRole = function(role) {
  return _.sum(Game.creeps, creep => creep.memory.role === role);
};

// Метод для управления количеством крипов
StructureSpawn.prototype.manageCreepPopulation = function() {
  const targetCounts = this.determineTargetCreepCount();

  // Сбор текущих количеств крипов по ролям
  const currentCounts = {
      harvester: this.countCreepsByRole('harvester'),
      upgrader: this.countCreepsByRole('upgrader'),
      builder: this.countCreepsByRole('builder'),
      miner: this.countCreepsByRole('miner'),
      repairer: this.countCreepsByRole('repairer'),
      military: this.countCreepsByRole('military'),
      solder: this.countCreepsByRole('solder'),
      mineralMiner: this.countCreepsByRole('mineralMiner'),
      defender: this.countCreepsByRole('defender'),
  };

  if (currentCounts.defender < targetCounts.defender) {
    this.createCreepByRole('defender');
    console.log("Attention! We are being attacked!")
    return 'Attention! We are being attacked';
  }

  if (currentCounts.harvester < 2) {
    this.createCreepByRole('harvester');
    return 'Warning: Too fwe harvesters.';
  }

  // Создаем недостающих крипов для каждой роли
  Object.keys(targetCounts).forEach(role => {
      if (currentCounts[role] < targetCounts[role]) {
          this.createCreepByRole(role);
      }
  });

  Object.keys(currentCounts).forEach(role => {
    if(currentCounts[role] - targetCounts[role] > 0) {
      const creepKill = _.find(Game.creeps, creep => creep.memory.role === role)
      if(creepKill) {
        if (creepKill.store.getUsedCapacity === 0) {
          creepKill.suicide();
        }
      }
    }
  });
};
