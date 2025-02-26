import { NameSpace } from '../root-reducer';
import { State } from '../../types/state';

export const getPageCount = (state: State): string => state[NameSpace.page].pageCount;
export const getTotalCount = (state: State): string => state[NameSpace.page].totalCount;
