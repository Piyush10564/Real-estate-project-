import React from 'react';
import StarRatings from 'react-star-ratings';
import '../styles/ReviewCard.css';

function ReviewCard({ review }) {
  const reviewDate = new Date(review.createdAt).toLocaleDateString();
  const reviewerAvatarUrl =
    review.reviewer?.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(`${review.reviewer?.firstName || 'U'} ${review.reviewer?.lastName || 'ser'}`)}&background=2f261f&color=f7f2eb&size=96`;

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <img 
            src={reviewerAvatarUrl} 
            alt={review.reviewer?.firstName || 'Reviewer'}
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
