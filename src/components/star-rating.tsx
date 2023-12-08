import { Star } from 'lucide-react';

export default function StarRating({
  totalStars = 5,
  rating,
  onRatingChange,
}: {
  totalStars?: number;
  rating: number;
  onRatingChange: (star: number) => void;
}) {
  const handleStarClick = (selectedRating: number) => {
    onRatingChange(selectedRating);
  };

  return (
    <div className='flex items-center'>
      {[...Array(totalStars)].map((_, index) => (
        <button
          type='button'
          key={index}
          onClick={() => handleStarClick(index + 1)}
          className={`focus:outline-none`}>
          <Star
            className={`w-8 h-8 ${
              index + 1 <= rating
                ? 'fill-yellow-400 stroke-yellow-400'
                : 'stroke-yellow-300 stroke-1'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
