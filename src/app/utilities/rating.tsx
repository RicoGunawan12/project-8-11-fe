import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (value: number) => void;
  disabled?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, disabled = false }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const handleMouseEnter = (value: number) => {
    if (!disabled) {
      setHovered(value);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHovered(null);
    }
  };

  const handleClick = (value: number) => {
    if (!disabled && onRatingChange) {
      onRatingChange(value);
    }
  };

  const getFillPercentage = (value: number) => {
    const effectiveRating = hovered !== null ? hovered : rating;
    if (effectiveRating >= value) return 100;
    if (effectiveRating + 1 > value) {
      return Math.max(0, (effectiveRating - value + 1) * 100);
    }
    return 0; // Fully gray
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((value) => {
        const gradientId = `star-gradient-${value}-${Math.random()}`; // Ensure unique id
        return (
          <svg
            key={value}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`w-6 h-6 ${disabled ? "cursor-default" : "cursor-pointer"}`}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(value)}
          >
            <defs>
              <linearGradient id={gradientId}>
                <stop offset={`${getFillPercentage(value)}%`} stopColor="black" />
                <stop offset={`${getFillPercentage(value)}%`} stopColor="gray" />
              </linearGradient>
            </defs>
            <path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              fill={`url(#${gradientId})`}
            />
          </svg>
        );
      })}
    </div>
  );
};

export default StarRating;
