export const set = (key, value) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

export const get = key => {
  return JSON.parse(sessionStorage.getItem(key));
};

export const getUser = () => {
  return JSON.parse(sessionStorage.getItem('user'));
};


export const remove = key => {
  return sessionStorage.removeItem(key);
};
