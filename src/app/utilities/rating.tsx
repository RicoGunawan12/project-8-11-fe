import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (value: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const handleMouseEnter = (value: number) => setHovered(value);
  const handleMouseLeave = () => setHovered(null);

  const handleClick = (value: number) => {
    if (onRatingChange) {
      onRatingChange(value); // Only call onRatingChange if it's provided
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <svg
          key={value}
          xmlns="http://www.w3.org/2000/svg"
          fill={hovered === null ? (rating >= value ? "yellow" : "gray") : (hovered >= value ? "yellow" : "gray")}
          viewBox="0 0 20 20"
          className="w-6 h-6 cursor-pointer"
          onMouseEnter={() => handleMouseEnter(value)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(value)}
        >
          <path
            d="M10 15l-3.09 1.636 0.59-3.847L3 7.765l3.91-0.368L10 2l2.09 4.397 3.91 0.368-2.5 4.924 0.59 3.847L10 15z"
          />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
