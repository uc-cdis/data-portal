import { useState, useEffect } from 'react';

export const useFetch = (fetch, accessor) => {
  const [fetched, setFetched] = useState([]);
  useEffect(() => {
    if (fetch?.data?.[`${accessor}`]) {
      setFetched(fetch.data[`${accessor}`]);
    }
  }, [fetch]);
  return fetched;
};

export const useFilter = (array, search, field) => {
  const [filtered, setFiltered] = useState([]);
  useEffect(() => {
    if (array?.length) {
      setFiltered(array.filter((item) => item[`${field}`]?.toLowerCase().includes(`${search}`.toLowerCase())));
    }
  }, [array, search]);

  return filtered;
};
