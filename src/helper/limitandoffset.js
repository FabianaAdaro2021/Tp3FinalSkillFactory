const limitAndOffset = (limit, offset, data) => {
  if (limit && offset) {
    return data.filter((item) => item.id >= limit && item.id <= offset);
  } else if (limit) {
    return data.filter((item) => item.id >= limit);
  } else if (offset) {
    return data.filter((item) => item.id <= offset);
  }
  return data;
};

module.exports = {
  limitAndOffset,
};
