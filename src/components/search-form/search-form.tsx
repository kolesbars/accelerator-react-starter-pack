import SearchItem from './search-item';
import { useState, useEffect } from 'react';
import { emptyGuitar } from '../../const';
import {GuitarType} from '../../types/guitar';
import {useSearchParams} from 'react-router-dom';
import {ChangeEvent} from 'react';
import { APIRoute } from '../../const';
//import useDebounce from '../../hooks/use-debounce';
import {AxiosInstance} from 'axios';

//const DELAY = 500;

type SearchFormProps = {
  api: AxiosInstance,
  guitars: GuitarType[]
}

function SearchForm({guitars, api}: SearchFormProps): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchText = searchParams.get('name_like') || '';

  const [searchValue, setSearchValue] = useState(searchText);
  const [similarGuitars, setSimilarGuitars] = useState([emptyGuitar]);

  const handleChangeSearchForm = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchValue(e.target.value);
  };

  //const debounceSearchValue = useDebounce(searchValue, DELAY);

  const searchSimilarGuitars = async () => {
    const {data} = await api.get<GuitarType[]>(`${APIRoute.Guitars}?${searchParams}`);
    setSimilarGuitars(data);
  };

  useEffect(() => {
    setSearchParams({'name_like' : searchValue});
  }, [searchValue]);

  useEffect(() => {
    searchSimilarGuitars();
  }, [searchParams]);

  return (
    <div className="form-search">
      <form className="form-search__form">
        <button className="form-search__submit" type="submit">
          <svg
            className="form-search__icon"
            width="14"
            height="15"
            aria-hidden="true"
          >
            <use xlinkHref="#icon-search"></use>
          </svg>
          <span className="visually-hidden">Начать поиск</span>
        </button>
        <input
          className="form-search__input"
          id="search"
          type="text"
          autoComplete="off"
          placeholder="что вы ищите?"
          onChange={handleChangeSearchForm}
        />
        <label className="visually-hidden" htmlFor="search">
                  Поиск
        </label>
      </form>
      <ul className={`form-search__select-list ${searchValue === '' ? 'hidden' : ''}`}>
        {similarGuitars.map((guitar) =>
          (
            <SearchItem
              key={guitar.id}
              guitar={guitar}
            />))}
      </ul>
    </div>
  );
}

export default SearchForm;