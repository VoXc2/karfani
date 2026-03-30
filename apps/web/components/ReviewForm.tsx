'use client';

import { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReviewFormProps {
  caravanId: string;
  onSubmit?: () => void;
}

const MAX_CHARS = 500;

export default function ReviewForm({ caravanId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const displayRating = hoveredRating || rating;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('يرجى اختيار التقييم');
      return;
    }

    // Mock submit
    console.log('Review submitted:', { caravanId, rating, comment });
    setSubmitted(true);
    onSubmit?.();
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-cream-dark shadow-sm text-center">
        <div className="w-16 h-16 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-olive" />
        </div>
        <h3 className="text-xl font-bold text-charcoal mb-2">شكراً لتقييمك!</h3>
        <p className="text-charcoal-light">تم إرسال تقييمك بنجاح وسيظهر بعد المراجعة.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-cream-dark shadow-sm">
      <h3 className="text-lg font-bold text-charcoal mb-6">أضف تقييمك</h3>

      {/* Star Rating */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-charcoal mb-3">التقييم</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 focus:outline-none"
            >
              <Star
                className={`w-8 h-8 transition-colors duration-200 ${
                  star <= displayRating
                    ? 'fill-copper text-copper'
                    : 'fill-none text-gray-300'
                }`}
              />
            </motion.button>
          ))}
          {displayRating > 0 && (
            <span className="text-sm text-charcoal-light ms-2">
              {displayRating === 1 && 'سيء'}
              {displayRating === 2 && 'مقبول'}
              {displayRating === 3 && 'جيد'}
              {displayRating === 4 && 'جيد جداً'}
              {displayRating === 5 && 'ممتاز'}
            </span>
          )}
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Comment */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-charcoal mb-2">تعليقك (اختياري)</label>
        <textarea
          value={comment}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) {
              setComment(e.target.value);
            }
          }}
          rows={4}
          placeholder="شاركنا تجربتك مع هذا الكرفان..."
          className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition-all resize-none"
        />
        <div className="flex justify-end mt-1">
          <span className={`text-xs ${comment.length >= MAX_CHARS ? 'text-red-500' : 'text-charcoal-light'}`}>
            {comment.length}/{MAX_CHARS}
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-olive to-olive-dark text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-olive/25 transition-all"
      >
        إرسال التقييم
      </button>
    </form>
  );
}
