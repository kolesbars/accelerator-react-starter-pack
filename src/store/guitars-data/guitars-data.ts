import { GuitarsData } from '../../types/state';
import { updateGuitarsList } from '../action';
import { createReducer } from '@reduxjs/toolkit';

const initialState: GuitarsData = {
  guitarsList: [],
};

const guitarsData = createReducer(initialState, (builder) => {
  builder
    .addCase(updateGuitarsList, (state, action) => {
      state.guitarsList = action.payload;
    });
});

export {guitarsData};
