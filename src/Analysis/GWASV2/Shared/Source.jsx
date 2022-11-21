import React, {
  useContext, useState, useEffect, createContext,
} from 'react';
import { useSourceFetch } from '../../GWASWizard/wizardEndpoints/cohortMiddlewareApi';

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
