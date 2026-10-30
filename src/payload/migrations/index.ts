import * as migration_20261030_111906_initial from './20261030_111906_initial';

export const migrations = [
  {
    up: migration_20261030_111906_initial.up,
    down: migration_20261030_111906_initial.down,
    name: '20261030_111906_initial'
  },
];
