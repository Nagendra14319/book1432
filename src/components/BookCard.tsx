import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  genre: string;
  imageUrl: string;
  averageRating: number;
  reviewCount: number;
}

export default function BookCard({
  id,
  title,
  author,
  genre,
  imageUrl,
  averageRating,
  reviewCount,
}: BookCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/book/${id}`)}
      className="group cursor-pointer bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 hover:scale-105"
    >
      <div className="aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-700">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = 'https://images.pexels.com/photos/1301585/pexels-photo-1301585.jpeg?auto=compress&cs=tinysrgb&w=400';
          }}
        />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{author}</p>

        <div className="flex items-center justify-between">
          <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">
            {genre}
          </span>

          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({reviewCount})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
