import * as migration_20261019_133439_inicial from './20261019_133439_inicial';
import * as migration_20261019_145330_columnas_de_blob from './20261019_145330_columnas_de_blob';

export const migrations = [
  {
    up: migration_20261019_133439_inicial.up,
    down: migration_20261019_133439_inicial.down,
    name: '20261019_133439_inicial',
  },
  {
    up: migration_20261019_145330_columnas_de_blob.up,
    down: migration_20261019_145330_columnas_de_blob.down,
    name: '20261019_145330_columnas_de_blob'
  },
];
