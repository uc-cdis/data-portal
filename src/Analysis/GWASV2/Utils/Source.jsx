import React, {
  useContext, useState, useEffect, createContext,
} from 'react';
import PropTypes from 'prop-types';
import { useSourceFetch } from './cohortMiddlewareApi';

const SourceContext = createContext();

export function SourceContextProvider({ children }) {
  const [source, setSource] = useState(undefined);
  const { sourceId } = useSourceFetch();
  useEffect(() => {
    setSource(sourceId);
  }, [sourceId]);
  return (
    <SourceContext.Provider
      value={{
        source,
      }}
    >
      {children}
    </SourceContext.Provider>
  );
}

export function useSourceContext() {
  const context = useContext(SourceContext);
  if (context === undefined) {
    throw new Error('Context must be used within a Provider');
  }
  return context;
}

SourceContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
