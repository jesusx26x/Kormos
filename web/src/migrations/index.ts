import * as migration_20261019_133439_inicial from './20261019_133439_inicial';
import * as migration_20261019_145330_columnas_de_blob from './20261019_145330_columnas_de_blob';
import * as migration_20261019_164102_fotos_de_portada from './20261019_164102_fotos_de_portada';
import * as migration_20261019_164940_historial_de_cambios from './20261019_164940_historial_de_cambios';

export const migrations = [
  {
    up: migration_20261019_133439_inicial.up,
    down: migration_20261019_133439_inicial.down,
    name: '20261019_133439_inicial',
  },
  {
    up: migration_20261019_145330_columnas_de_blob.up,
    down: migration_20261019_145330_columnas_de_blob.down,
    name: '20261019_145330_columnas_de_blob',
  },
  {
    up: migration_20261019_164102_fotos_de_portada.up,
    down: migration_20261019_164102_fotos_de_portada.down,
    name: '20261019_164102_fotos_de_portada',
  },
  {
    up: migration_20261019_164940_historial_de_cambios.up,
    down: migration_20261019_164940_historial_de_cambios.down,
    name: '20261019_164940_historial_de_cambios'
  },
];
