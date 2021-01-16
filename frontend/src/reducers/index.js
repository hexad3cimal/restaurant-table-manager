import user from './user';
import app from './common';
import branch from './branch';
import table from './table';
import product from './product';
import order from './order';
import kitchen from './kitchen'
import tag from './tag'
import category from './category'
export default {
  ...user,
  ...app,
  ...branch,
  ...table,
  ...product,
  ...order,
  ...kitchen,
  ...tag,
  ...category
};
