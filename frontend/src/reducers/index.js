import user from './user';
import app from './common';
import branch from './branch';
import table from './table';
import product from './product';
import order from './order';
import kitchen from './kitchen'
export default {
  ...user,
  ...app,
  ...branch,
  ...table,
  ...product,
  ...order,
  ...kitchen
};
