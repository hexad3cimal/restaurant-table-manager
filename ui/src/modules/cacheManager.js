export const set = (key, value) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

export const get = key => {
  return JSON.stringify(sessionStorage.getItem(key));
};

export const remove = key => {
  return sessionStorage.removeItem(key);
};
