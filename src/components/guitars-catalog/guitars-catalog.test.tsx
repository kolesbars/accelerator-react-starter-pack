import GuitarCatalog from './guitars-catalog';
import {BrowserRouter} from 'react-router-dom';
import { Provider } from 'react-redux';
import {render, screen} from '@testing-library/react';
import { emptyGuitar } from '../../const';
import {configureMockStore} from '@jedmao/redux-mock-store';
import { State } from '../../types/state';
import { Action } from 'redux';
import { createAPI } from '../../services/api';
import thunk, {ThunkDispatch} from 'redux-thunk';


const api = createAPI();

const middlewares = [thunk.withExtraArgument(api)];

const mockStore = configureMockStore<
    State,
    Action,
    ThunkDispatch<State, typeof api, Action>
    >(middlewares);

const store = mockStore({
  GUITARS: {guitarsList: []},
  PARAMS: {sortParams: {}, filterParams: {}, searchFormParams: {}, paginationParams: {}},
  PAGE: {pageCount: '', totalCount: ''},
  CART: {guitarsID: [], guitarsQuantity: []},
});

describe('Component: GuitarsCatalog', () => {
  it('should render correctly', () => {

    const cb = jest.fn();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <GuitarCatalog
            guitars={[emptyGuitar]}
            onSetIsAddToCartModalHidden={cb}
            onSetCurrentGuitarData={cb}
          />
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByTestId('guitars-catalog')).toBeInTheDocument();
    expect(screen.getByText(/Подробнее/i)).toBeInTheDocument();
  });
});
