import { apiFetch } from './client'

export type ReviewDto = {
  id: number
  reviewerId: number | null
  reviewerName: string | null
  targetUserId: number | null
  rating: number
  comment: string | null
  createdAt: string
}

export type UserReviewSummaryDto = {
  averageRating: number
  reviewCount: number
}

export function listUserReviews(userId: number): Promise<ReviewDto[]> {
  return apiFetch(`/api/users/${userId}/reviews`)
}

export function getUserReviewSummary(userId: number): Promise<UserReviewSummaryDto> {
  return apiFetch(`/api/users/${userId}/reviews/summary`)
}

export function createReview(body: {
  targetUserId: number
  rating: number
  comment?: string
}): Promise<ReviewDto> {
  return apiFetch('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
