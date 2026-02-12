import React from 'react';
import StarRatings from 'react-star-ratings';
import '../styles/ReviewCard.css';

function ReviewCard({ review }) {
  const reviewDate = new Date(review.createdAt).toLocaleDateString();

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <img 
            src={review.reviewer?.profileImage || 'https://via.placeholder.com/50'} 
            alt={review.reviewer?.firstName}
            className="reviewer-avatar"
          />
          <div>
            <h4>{review.reviewer?.firstName} {review.reviewer?.lastName}</h4>
            <p className="review-date">{reviewDate}</p>
          </div>
        </div>
        <StarRatings
          rating={review.rating}
          starRatedColor="#ffc107"
          numberOfStars={5}
          starDimension="18px"
          starSpacing="2px"
        />
      </div>
      <p className="review-comment">{review.comment}</p>
    </div>
  );
}

export default ReviewCard;
