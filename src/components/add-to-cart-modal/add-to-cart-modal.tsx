import { addGuitarToCart } from '../../store/action';
import { useDispatch} from 'react-redux';
import {getGuitarType} from '../../utils/common';
import { KeyboardEvent } from 'react';
import { KeyCode, DEFAULT_QUANTITY, DEFAULT_GUITARS_IN_CART } from '../../const';
import { GuitarType } from '../../types/guitar';

type AddToCartModalProps = {
  data: GuitarType | undefined,
  onSetIsAddToCartModalHidden: (value: boolean) => void,
  onSetIsAddSuccessModalHidden: (value: boolean) => void,
}

function AddToCartModal(props: AddToCartModalProps):JSX.Element {

  const {data, onSetIsAddToCartModalHidden, onSetIsAddSuccessModalHidden} = props;

  const dispatch = useDispatch();

  const handleAddToCartClick = () => {
    const storageQuantity = localStorage.getItem(`${data?.id}`);

    if (data && storageQuantity !== null && +storageQuantity > DEFAULT_QUANTITY) {
      localStorage.setItem(`${data.id}`, (+storageQuantity+1).toString());
    } else {
      dispatch(addGuitarToCart(data?.id || DEFAULT_GUITARS_IN_CART));
    }
    onSetIsAddToCartModalHidden(true);
    onSetIsAddSuccessModalHidden(false);
  };

  const handleCloseClick = () => {
    onSetIsAddToCartModalHidden(true);
  };

  const handleOverlayClick = () => {
    onSetIsAddToCartModalHidden(true);
  };

  const handleEscKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if(e.keyCode === KeyCode.Escape) {
      onSetIsAddToCartModalHidden(true);
    }
  };

  return(
    <div className="modal is-active modal-for-ui-kit" onKeyDown={handleEscKeyDown}>
      <div className="modal__wrapper">
        <div
          className="modal__overlay"
          data-close-modal
          onClick={handleOverlayClick}
        >
        </div>
        <div className="modal__content">
          <h2 className="modal__header title title--medium">Добавить товар в корзину</h2>
          <div className="modal__info"><img className="modal__img" src={`/${data?.previewImg}`} width="67" height="137" alt={data?.name}/>
            <div className="modal__info-wrapper">
              <h3 className="modal__product-name title title--little title--uppercase">{data?.name}</h3>
              <p className="modal__product-params modal__product-params--margin-11">{`Артикул: ${data?.vendorCode}`}</p>
              <p className="modal__product-params">{`${getGuitarType(data?.type)}, ${data?.stringCount} струнная`}</p>
              <p className="modal__price-wrapper"><span className="modal__price">Цена:</span><span className="modal__price">{`${data?.price} ₽`}</span></p>
            </div>
          </div>
          <div className="modal__button-container">
            <button
              className="button button--red button--big modal__button modal__button--add"
              onClick={handleAddToCartClick}
            >Добавить в корзину
            </button>
          </div>
          <button
            className="modal__close-btn button-cross"
            type="button"
            aria-label="Закрыть"
            onClick={handleCloseClick}
          ><span className="button-cross__icon"></span><span className="modal__close-btn-interactive-area"></span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddToCartModal;
