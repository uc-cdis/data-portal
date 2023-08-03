const initialTableSort = (data) => data.sort((a, b) => {
  if (a.finishedAt === null && b.finishedAt === null) {
    return 0;
  } else if (a.finishedAt === null) {
    return -1; // a comes first as it has finishedAt null
  } else if (b.finishedAt === null) {
    return 1; // b comes first as it has finishedAt null
  } else {
    // Sort by finishedAt in descending order
    return new Date(b.finishedAt) - new Date(a.finishedAt);
  }
});

export default initialTableSort;
