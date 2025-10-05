import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, CreditCard as Edit, Trash2, Calendar, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

interface Review {
  _id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  description: string;
  imageUrl: string;
  userId: string;
  username: string;
  averageRating: number;
  reviews: Review[];
}

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);

  const loadBook = async () => {
    try {
      setLoading(true);
      const data = await api.getBook(id!);
      setBook(data);
    } catch (error) {
      console.error('Failed to load book:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBook();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setSubmitting(true);
      if (editingReview) {
        await api.updateReview(token, editingReview, { rating, comment });
        setEditingReview(null);
      } else {
        await api.createReview(token, { bookId: id, rating, comment });
      }
      setRating(5);
      setComment('');
      loadBook();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!token || !confirm('Delete this review?')) return;

    try {
      await api.deleteReview(token, reviewId);
      loadBook();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDeleteBook = async () => {
    if (!token || !confirm('Delete this book and all its reviews?')) return;

    try {
      await api.deleteBook(token, id!);
      navigate('/');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const startEditReview = (review: Review) => {
    setEditingReview(review._id);
    setRating(review.rating);
    setComment(review.comment);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading book...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Book not found</p>
      </div>
    );
  }

  const userReview = book.reviews.find((r) => r.userId === user?.id);
  const canReview = isAuthenticated && !userReview && book.userId !== user?.id;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 mb-8">
          <div className="md:flex">
            <div className="md:w-1/3 bg-slate-100 dark:bg-slate-700">
              <img
                src={book.imageUrl}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.pexels.com/photos/1301585/pexels-photo-1301585.jpeg?auto=compress&cs=tinysrgb&w=800';
                }}
              />
            </div>

            <div className="md:w-2/3 p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    {book.title}
                  </h1>
                  <p className="text-xl text-slate-600 dark:text-slate-400 mb-4">
                    by {book.author}
                  </p>
                </div>

                {isAuthenticated && user?.id === book.userId && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/edit-book/${book._id}`)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDeleteBook}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                  {book.genre}
                </span>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">{book.year}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">
                    {book.averageRating > 0 ? book.averageRating.toFixed(1) : 'N/A'}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    ({book.reviews.length} reviews)
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Description
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {book.description}
                </p>
              </div>

              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                <User className="w-4 h-4" />
                <span>Added by {book.username}</span>
              </div>
            </div>
          </div>
        </div>

        {canReview && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Write a Review
            </h2>

            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Your Review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors"
                  placeholder="Share your thoughts about this book..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
              </button>

              {editingReview && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingReview(null);
                    setRating(5);
                    setComment('');
                  }}
                  className="ml-4 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Reviews ({book.reviews.length})
          </h2>

          {book.reviews.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400 text-center py-8">
              No reviews yet. Be the first to review this book!
            </p>
          ) : (
            <div className="space-y-6">
              {book.reviews.map((review) => (
                <div
                  key={review._id}
                  className="border-b border-slate-200 dark:border-slate-700 pb-6 last:border-0"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {review.username}
                        </span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {isAuthenticated && user?.id === review.userId && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditReview(review)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-slate-700 dark:text-slate-300">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
