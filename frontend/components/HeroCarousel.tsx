"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';
import { Database } from '@/lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

interface HeroCarouselProps {
  products: Product[];
}

export function HeroCarousel({ products }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [products.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const next = prev + newDirection;
      if (next < 0) return products.length - 1;
      if (next >= products.length) return 0;
      return next;
    });
  };

  if (products.length === 0) return null;

  const currentProduct = products[currentIndex];

  return (
    <div className="relative h-[650px] bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0"
        >
          <div className="container mx-auto px-6 max-w-7xl h-full flex items-center">
            <div className="grid md:grid-cols-2 gap-16 items-center w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div className="inline-block">
                  <span className="bg-gray-900 text-white text-xs font-light px-4 py-2 rounded-full tracking-wide">
                    TOP SELLING
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-medium leading-tight text-gray-900 tracking-tight">
                  {currentProduct.name}
                </h1>
                <p className="text-base font-light text-gray-500 max-w-md leading-relaxed">
                  {currentProduct.description}
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(currentProduct.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-light text-gray-500">
                    {currentProduct.rating} ({currentProduct.review_count} reviews)
                  </span>
                </div>
                <div className="flex items-baseline space-x-4">
                  <span className="text-3xl font-medium text-gray-900">${currentProduct.price}</span>
                </div>
                <Link href={`/products/${currentProduct.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gray-900 text-white px-10 py-4 rounded-lg font-light text-base hover:bg-gray-800 transition-colors"
                  >
                    Shop Now
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="relative h-[540px]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl transform rotate-3"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl transform rotate-1"></div>
                <div className="relative h-full rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={currentProduct.images[0]}
                    alt={currentProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => paginate(-1)}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm p-3 rounded-lg hover:bg-white transition-colors z-10 text-gray-700"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => paginate(1)}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm p-3 rounded-lg hover:bg-white transition-colors z-10 text-gray-700"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-2.5 z-10">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex ? 'w-8 bg-gray-900' : 'w-1.5 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
