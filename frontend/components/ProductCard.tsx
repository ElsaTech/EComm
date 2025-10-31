"use client";

import { motion } from 'framer-motion';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Database } from '@/lib/database.types';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();
  const inWishlist = isInWishlist(product.id);

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/auth/login');
      return;
    }
    await toggleWishlist(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group relative"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-50">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {product.stock_quantity < 10 && product.stock_quantity > 0 && (
            <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-light px-3 py-1.5 rounded-full">
              Only {product.stock_quantity} left
            </div>
          )}

          {product.is_top_selling && (
            <div className="absolute top-3 left-3 bg-gray-900 text-white text-xs font-light px-3 py-1.5 rounded-full">
              Bestseller
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm p-2.5 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart
              className={`w-4.5 h-4.5 ${
                inWishlist ? 'fill-gray-900 text-gray-900' : 'text-gray-600'
              }`}
            />
          </motion.button>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-gray-900 py-2.5 rounded-lg font-light text-sm flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Quick Add</span>
            </motion.button>
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-base text-gray-900 line-clamp-1">{product.name}</h3>
            <span className="font-medium text-base text-gray-900">${product.price}</span>
          </div>

          <p className="text-sm font-light text-gray-500 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
              <span className="text-xs font-light text-gray-500 ml-2">
                {product.rating} ({product.review_count})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.colors.slice(0, 4).map((color, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border border-gray-200"
                style={{
                  backgroundColor: color.toLowerCase().includes('white')
                    ? '#ffffff'
                    : color.toLowerCase().includes('black')
                    ? '#000000'
                    : color.toLowerCase().includes('blue')
                    ? '#3b82f6'
                    : color.toLowerCase().includes('navy')
                    ? '#1e3a8a'
                    : color.toLowerCase().includes('gray') || color.toLowerCase().includes('grey')
                    ? '#6b7280'
                    : color.toLowerCase().includes('red')
                    ? '#ef4444'
                    : color.toLowerCase().includes('green') || color.toLowerCase().includes('olive')
                    ? '#22c55e'
                    : color.toLowerCase().includes('beige') || color.toLowerCase().includes('khaki') || color.toLowerCase().includes('sand')
                    ? '#d4c5a9'
                    : color.toLowerCase().includes('cream')
                    ? '#f5f5dc'
                    : '#9ca3af',
                }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500 self-center">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
