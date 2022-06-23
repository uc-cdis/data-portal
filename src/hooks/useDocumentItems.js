import { useEffect, useState } from 'react';

async function fetchLatestDocuments() {
  const response = await fetch('/user/user/documents/latest');
  if (!response.ok) throw Error();
  return response.json();
}

const initialData =
  /** @type {import('../UserPopup').UserReviewDocument[]} */ ([]);

export default function useLatestDocuments() {
  const [data, setData] = useState(initialData);
  const [isError, setIsError] = useState(false);

  function refresh() {
    setIsError(false);
    fetchLatestDocuments()
      .then(setData)
      .catch(() => setIsError(true));
  }
  useEffect(refresh, []);

  return { data, isError, refresh };
}
