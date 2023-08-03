const initialTableSort = (data) => data.sort((a, b) => {
  if (a.finishedAt === null && b.finishedAt === null) {
    return 0;
  } if (a.finishedAt === null) {
    return -1;
  } if (b.finishedAt === null) {
    return 1;
  }
  return new Date(b.finishedAt) - new Date(a.finishedAt);
});

export default initialTableSort;
