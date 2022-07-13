import { useDispatch, useSelector } from 'react-redux';

/** @type {() => import('./types').AppDispatch} */
export const useAppDispatch = useDispatch;

/** @type {import('react-redux').TypedUseSelectorHook<import('./types').RootState>} */
export const useAppSelector = useSelector;
