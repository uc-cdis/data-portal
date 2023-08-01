const initialTableSort = (data) => data.sort((a, b) => {
  if (!a.finishedAt) return -1;
  if (!b.finishedAt) return -1;
  return b?.finishedAt.localeCompare(a?.finishedAt);
});

export default initialTableSort;
