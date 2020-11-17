import user from './user';
import app from './common';
import branch from './branch';
import table from './table';

export default {
  ...user,
  ...app,
  ...branch,
  ...table,
};
