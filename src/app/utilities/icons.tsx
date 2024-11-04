import { faStar, faStarAndCrescent, faStarHalf, faStarHalfAlt, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const renderStars = (rating : number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <FontAwesomeIcon key={`full-${i}`} icon={faStar} className="text-yellow-400" />
        ))}
        {hasHalfStar && <FontAwesomeIcon icon={faStarHalf} className="text-yellow-400" />}
      </div>
    )
  };