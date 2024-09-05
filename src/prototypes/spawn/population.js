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
      mineralMiner: this.countCreepsByRole('mineralMiner'),
  };

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
        creepKill.suicide();
      }
    }
  });
};
