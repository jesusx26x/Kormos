import * as migration_20261019_132024_inicial from './20261019_132024_inicial';

export const migrations = [
  {
    up: migration_20261019_132024_inicial.up,
    down: migration_20261019_132024_inicial.down,
    name: '20261019_132024_inicial'
  },
];
