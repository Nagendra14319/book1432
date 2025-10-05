import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, BookOpen, MessageSquare, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

interface Stats {
  totalBooks: number;
  totalReviewsGiven: number;
  totalReviewsReceived: number;
  ratingDistribution: { [key: number]: number };
  givenRatingDistribution: { [key: number]: number };
}

export default function Profile() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [myBooks, setMyBooks] = useState<any[]>([]);
  const [reviewsGiven, setReviewsGiven] = useState<any[]>([]);
  const [reviewsReceived, setReviewsReceived] = useState<any[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const data = await api.getProfile(token);
      setMyBooks(data.myBooks);
      setReviewsGiven(data.reviewsGiven);
      setReviewsReceived(data.reviewsReceived);
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const maxReceivedValue = Math.max(...Object.values(stats?.ratingDistribution || {}), 1);
  const maxGivenValue = Math.max(...Object.values(stats?.givenRatingDistribution || {}), 1);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stats?.totalBooks || 0}
                </p>
                <p className="text-slate-600 dark:text-slate-400">Books Added</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stats?.totalReviewsGiven || 0}
                </p>
                <p className="text-slate-600 dark:text-slate-400">Reviews Given</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stats?.totalReviewsReceived || 0}
                </p>
                <p className="text-slate-600 dark:text-slate-400">Reviews Received</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              Ratings Received on My Books
            </h2>

            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {rating}
                    </span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>

                  <div className="flex-1 h-8 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 flex items-center justify-end pr-3"
                      style={{
                        width: `${
                          (stats?.ratingDistribution[rating] || 0) / maxReceivedValue * 100
                        }%`,
                        minWidth: stats?.ratingDistribution[rating] ? '40px' : '0',
                      }}
                    >
                      {stats?.ratingDistribution[rating] ? (
                        <span className="text-sm font-semibold text-white">
                          {stats.ratingDistribution[rating]}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <Star className="w-5 h-5 mr-2 text-green-400" />
              Ratings I've Given to Books
            </h2>

            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {rating}
                    </span>
                    <Star className="w-4 h-4 fill-green-400 text-green-400" />
                  </div>

                  <div className="flex-1 h-8 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 flex items-center justify-end pr-3"
                      style={{
                        width: `${
                          (stats?.givenRatingDistribution[rating] || 0) / maxGivenValue * 100
                        }%`,
                        minWidth: stats?.givenRatingDistribution[rating] ? '40px' : '0',
                      }}
                    >
                      {stats?.givenRatingDistribution[rating] ? (
                        <span className="text-sm font-semibold text-white">
                          {stats.givenRatingDistribution[rating]}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">My Books</h2>

          {myBooks.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400 text-center py-8">
              You haven't added any books yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myBooks.map((book) => (
                <div
                  key={book._id}
                  onClick={() => navigate(`/book/${book._id}`)}
                  className="cursor-pointer border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-lg transition-all hover:scale-105"
                >
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    by {book.author}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {book.averageRating > 0 ? book.averageRating.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {book.reviewCount} reviews
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Reviews I've Given
          </h2>

          {reviewsGiven.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400 text-center py-8">
              You haven't written any reviews yet.
            </p>
          ) : (
            <div className="space-y-4">
              {reviewsGiven.map((review) => (
                <div
                  key={review._id}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      onClick={() => navigate(`/book/${review.bookId._id}`)}
                      className="font-semibold text-slate-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {review.bookId.title}
                    </h3>
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
                  <p className="text-sm text-slate-700 dark:text-slate-300">{review.comment}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Reviews Received on My Books
          </h2>

          {reviewsReceived.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400 text-center py-8">
              No one has reviewed your books yet.
            </p>
          ) : (
            <div className="space-y-4">
              {reviewsReceived.map((review) => (
                <div
                  key={review._id}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3
                        onClick={() => navigate(`/book/${review.bookId._id}`)}
                        className="font-semibold text-slate-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {review.bookId.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        by {review.username}
                      </p>
                    </div>
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
                  <p className="text-sm text-slate-700 dark:text-slate-300">{review.comment}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
