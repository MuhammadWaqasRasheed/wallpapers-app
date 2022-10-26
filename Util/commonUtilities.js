exports.isNullOrEmptystring = (str) => {
  if (!str || str.trim().length == 0) {
    return true;
  }
  return false;
};

