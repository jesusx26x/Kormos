import * as migration_20261019_133439_inicial from './20261019_133439_inicial';
import * as migration_20261019_145330_columnas_de_blob from './20261019_145330_columnas_de_blob';
import * as migration_20261019_164102_fotos_de_portada from './20261019_164102_fotos_de_portada';
import * as migration_20261019_164940_historial_de_cambios from './20261019_164940_historial_de_cambios';
import * as migration_20261019_180613_historial_servicios_paquetes_marcas from './20261019_180613_historial_servicios_paquetes_marcas';
import * as migration_20261019_181500_datos_del_cliente from './20261019_181500_datos_del_cliente';
import * as migration_20261021_165123_precios_aracena from './20261021_165123_precios_aracena';
import * as migration_20261021_170000_catalogo_aracena from './20261021_170000_catalogo_aracena';

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
    name: '20261019_164940_historial_de_cambios',
  },
  {
    up: migration_20261019_180613_historial_servicios_paquetes_marcas.up,
    down: migration_20261019_180613_historial_servicios_paquetes_marcas.down,
    name: '20261019_180613_historial_servicios_paquetes_marcas',
  },
  {
    up: migration_20261019_181500_datos_del_cliente.up,
    down: migration_20261019_181500_datos_del_cliente.down,
    name: '20261019_181500_datos_del_cliente',
  },
  {
    up: migration_20261021_165123_precios_aracena.up,
    down: migration_20261021_165123_precios_aracena.down,
    name: '20261021_165123_precios_aracena',
  },
  {
    up: migration_20261021_170000_catalogo_aracena.up,
    down: migration_20261021_170000_catalogo_aracena.down,
    name: '20261021_170000_catalogo_aracena',
  },
];
