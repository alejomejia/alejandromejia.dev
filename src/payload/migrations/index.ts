import * as migration_20261030_111906_initial from './20261030_111906_initial';
import * as migration_20261030_202334_profile_cv from './20261030_202334_profile_cv';

export const migrations = [
  {
    up: migration_20261030_111906_initial.up,
    down: migration_20261030_111906_initial.down,
    name: '20261030_111906_initial',
  },
  {
    up: migration_20261030_202334_profile_cv.up,
    down: migration_20261030_202334_profile_cv.down,
    name: '20261030_202334_profile_cv'
  },
];
