import { APIRoute } from '../../const';
import { updateFilterParams } from '../../store/action';
import { getFilterParams, getSortParams } from '../../store/search-params/selectors';
import {ChangeEvent, FocusEvent} from 'react';
import { useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GuitarType } from '../../types/guitar';
import StringCheckbox from './string-checkbox';
import { URLSearchParamsInit } from 'react-router-dom';
import {AxiosInstance} from 'axios';

//const DELAY = 500;

type FiltersFormProps = {
  api: AxiosInstance,
  searchParams: URLSearchParams,
  setSearchParams: (nextInit: URLSearchParamsInit, navigateOptions?: { replace?: boolean | undefined; state?: any; } | undefined) => void,
}
const guitarStrings = [4,6,7,12];

function FiltersForm({api, searchParams, setSearchParams}: FiltersFormProps):JSX.Element {
  const sortParams = useSelector(getSortParams);
  const filterParams = useSelector(getFilterParams);

  const dispatch = useDispatch();

  const guitarTypes = searchParams.getAll('type') ?? [''];
  const stringCount = searchParams.getAll('stringCount') ?? [''];
  const priceGTE = searchParams.get('price_gte') ?? '';
  const priceLTE = searchParams.get('price_lte') ?? '';

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [filters, setFilters] = useState({
    'type': guitarTypes,
    'stringCount': stringCount,
    'price_gte': priceGTE || undefined,
    'price_lte': priceLTE || undefined,
  });

  // const debouncePriceMinValue = useDebounce(priceMinValue, DELAY);
  // const debouncePriceMaxValue = useDebounce(priceMaxValue, DELAY);

  const handleChangeType = (e: ChangeEvent<HTMLInputElement>) => {

    if(e.target.checked) {
      setFilters({...filters, 'type': [...filters['type'], e.target.name]});
    } else {
      setFilters({...filters, 'type' : filters['type'].filter((type) => type !== e.target.name)});
    }
  };

  const handleChangeStringCount = (e: ChangeEvent<HTMLInputElement>, count: string) => {

    if(e.target.checked) {
      setFilters({...filters, 'stringCount': [...filters['stringCount'], count]});
    } else {
      setFilters({...filters, 'stringCount': filters['stringCount'].filter((value) => value !== count)});
    }
  };

  const handleChangePriceField = (e: ChangeEvent<HTMLInputElement>, value: string) => {
    if (e.target.value !== '') {
      setFilters({...filters, [value] : e.target.value});
    } else {
      e.target.value = '';
    }
  };

  const hahdleOutMinField = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value < minPrice) {
      e.target.value = minPrice;
      setFilters({...filters, 'price_gte' : minPrice});
    }
  };

  const hahdleOutMaxField = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value > maxPrice) {
      e.target.value = maxPrice;
      setFilters({...filters, 'price_lte' : maxPrice});
    }
  };

  const loadMaxMinPrices = async () => {
    const {data} = await api.get<GuitarType[]>(`${APIRoute.Guitars}`);
    setMinPrice(Math.min(...data.map((guitar) => guitar.price)).toString());
    setMaxPrice(Math.max(...data.map((guitar) => guitar.price)).toString());
  };

  useEffect(() => {
    loadMaxMinPrices();
  }, []);

  useEffect(() => {
    if (filters['price_gte'] === undefined) {
      delete filters['price_gte'];
    }
    if (filters['price_lte'] === undefined) {
      delete filters['price_lte'];
    }

    dispatch(updateFilterParams(Object.assign(
      {},
      filterParams,
      filters,
    )));
  }, [filters]);

  useEffect(() => {
    setSearchParams({...sortParams, ...filterParams});
  }, [filterParams]);

  return (
    <form className="catalog-filter">
      <h2 className="title title--bigger catalog-filter__title">
                  Фильтр
      </h2>
      <fieldset className="catalog-filter__block">
        <legend className="catalog-filter__block-title">
                    Цена, ₽
        </legend>
        <div className="catalog-filter__price-range">
          <div className="form-input">
            <label className="visually-hidden">
                        Минимальная цена
            </label>
            <input
              type="number"
              placeholder={minPrice}
              id="priceMin"
              name="от"
              min='1'
              onChange={(evt) => handleChangePriceField(evt, 'price_gte')}
              onBlur={hahdleOutMinField}
              value={priceGTE}
            />
          </div>
          <div className="form-input">
            <label className="visually-hidden">
                        Максимальная цена
            </label>
            <input
              type="number"
              placeholder={maxPrice}
              id="priceMax"
              name="до"
              min='1'
              onChange={(evt) => handleChangePriceField(evt, 'price_lte')}
              onBlur={hahdleOutMaxField}
              value={priceLTE}
            />
          </div>
        </div>
      </fieldset>
      <fieldset className="catalog-filter__block">
        <legend className="catalog-filter__block-title">
                    Тип гитар
        </legend>
        <div className="form-checkbox catalog-filter__block-item">
          <input
            className="visually-hidden"
            type="checkbox"
            id="acoustic"
            name="acoustic"
            checked={filters['type'].includes('acoustic')}
            onChange={handleChangeType}
          />
          <label htmlFor="acoustic">Акустические гитары</label>
        </div>
        <div className="form-checkbox catalog-filter__block-item">
          <input
            className="visually-hidden"
            type="checkbox"
            id="electric"
            name="electric"
            checked={filters['type'].includes('electric')}
            onChange={handleChangeType}
          />
          <label htmlFor="electric">Электрогитары</label>
        </div>
        <div className="form-checkbox catalog-filter__block-item">
          <input
            className="visually-hidden"
            type="checkbox"
            id="ukulele"
            name="ukulele"
            checked={filters['type'].includes('ukulele')}
            onChange={handleChangeType}
          />
          <label htmlFor="ukulele">Укулеле</label>
        </div>
      </fieldset>
      <fieldset className="catalog-filter__block">
        <legend className="catalog-filter__block-title">
                    Количество струн
        </legend>
        {guitarStrings.map((count) =>
          (
            <StringCheckbox
              key={`${count}-key`}
              handleStringCount={handleChangeStringCount}
              count={count}
              currentStrings={filters['stringCount']}
              currentTypes={filters['type']}
            />))}
      </fieldset>
    </form>
  );
}

export default FiltersForm;
