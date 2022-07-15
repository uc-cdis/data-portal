import { useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';
import sessionMonitor from '../SessionMonitor';

export default function useSessionMonitor() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    sessionMonitor.useDispatch(dispatch);
    sessionMonitor.start();
  }, []);

  return sessionMonitor;
}
