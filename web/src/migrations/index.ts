import * as migration_20261019_133439_inicial from './20261019_133439_inicial';

export const migrations = [
  {
    up: migration_20261019_133439_inicial.up,
    down: migration_20261019_133439_inicial.down,
    name: '20261019_133439_inicial'
  },
];
