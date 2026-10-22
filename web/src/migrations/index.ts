import * as migration_20261019_133439_inicial from './20261019_133439_inicial';
import * as migration_20261019_145330_columnas_de_blob from './20261019_145330_columnas_de_blob';
import * as migration_20261019_164102_fotos_de_portada from './20261019_164102_fotos_de_portada';
import * as migration_20261019_164940_historial_de_cambios from './20261019_164940_historial_de_cambios';
import * as migration_20261019_180613_historial_servicios_paquetes_marcas from './20261019_180613_historial_servicios_paquetes_marcas';
import * as migration_20261019_181500_datos_del_cliente from './20261019_181500_datos_del_cliente';
import * as migration_20261021_165123_precios_aracena from './20261021_165123_precios_aracena';
import * as migration_20261021_170000_catalogo_aracena from './20261021_170000_catalogo_aracena';
import * as migration_20261022_160000_metrajes_aracena from './20261022_160000_metrajes_aracena';
import * as migration_20261022_184953_promocion from './20261022_184953_promocion';
import * as migration_20261022_185500_activar_promocion from './20261022_185500_activar_promocion';

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
  {
    up: migration_20261022_160000_metrajes_aracena.up,
    down: migration_20261022_160000_metrajes_aracena.down,
    name: '20261022_160000_metrajes_aracena',
  },
  {
    up: migration_20261022_184953_promocion.up,
    down: migration_20261022_184953_promocion.down,
    name: '20261022_184953_promocion',
  },
  {
    up: migration_20261022_185500_activar_promocion.up,
    down: migration_20261022_185500_activar_promocion.down,
    name: '20261022_185500_activar_promocion',
  },
];
