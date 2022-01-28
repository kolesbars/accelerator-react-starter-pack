import {RATING_STAR_MAX_VALUE} from '../../const';

type RatingStarsProps = {
  rating: number,
}

function RatingStars({rating}: RatingStarsProps): JSX.Element {

  const getRatingStars = (ratingValue: number) => {
    const stars = [];

    for (let i = 0; i < Math.ceil(ratingValue); i++) {
      stars.push(
        <svg width="12" height="11" aria-hidden="true" key={`${i}-star`}>
          <use xlinkHref="#icon-full-star" data-testid='rating-star'></use>
        </svg>);
    }
    for (let i = 0; i < Math.floor(RATING_STAR_MAX_VALUE - ratingValue); i++) {
      stars.push(
        <svg width="12" height="11" aria-hidden="true" key={`${RATING_STAR_MAX_VALUE - i}-star`}>
          <use xlinkHref="#icon-star"></use>
        </svg>);
    }

    return stars;
  };

  return (
    <>
      {getRatingStars(rating).map((star) => star)}
    </>

  );
}

export default RatingStars;