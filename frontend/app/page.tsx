"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, Shield } from 'lucide-react';
import { Database } from '@/lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

export default function Home() {
  const [topSellingProducts, setTopSellingProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);

    const { data: topSelling } = await supabase
      .from('products')
      .select('*')
      .eq('is_top_selling', true)
      .order('rating', { ascending: false })
      .limit(6);

    const { data: recent } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4);

    if (topSelling) setTopSellingProducts(topSelling);
    if (recent) setNewArrivals(recent);
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <HeroCarousel products={topSellingProducts.slice(0, 3)} />

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-10 rounded-xl hover:bg-gray-50/50 transition-all duration-300"
            >
              <div className="bg-gray-900 text-white p-5 rounded-2xl mb-6">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-medium mb-3 text-gray-900">Premium Quality</h3>
              <p className="text-sm font-light text-gray-500 leading-relaxed">
                Carefully curated collection of the finest unisex clothing
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center text-center p-10 rounded-xl hover:bg-gray-50/50 transition-all duration-300"
            >
              <div className="bg-gray-900 text-white p-5 rounded-2xl mb-6">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-medium mb-3 text-gray-900">Secure Shopping</h3>
              <p className="text-sm font-light text-gray-500 leading-relaxed">
                Safe and secure checkout with multiple payment options
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center text-center p-10 rounded-xl hover:bg-gray-50/50 transition-all duration-300"
            >
              <div className="bg-gray-900 text-white p-5 rounded-2xl mb-6">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-medium mb-3 text-gray-900">Fast Delivery</h3>
              <p className="text-sm font-light text-gray-500 leading-relaxed">
                Quick and reliable shipping to your doorstep
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between mb-16">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-medium mb-3 text-gray-900 tracking-tight"
              >
                Top Sellers
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-sm font-light text-gray-500"
              >
                Our most loved items by customers
              </motion.p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="group font-light border-gray-200 hover:border-gray-300">
                View All
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-100 rounded-xl mb-4"></div>
                  <div className="h-3 bg-gray-100 rounded mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {topSellingProducts.slice(0, 4).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between mb-16">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-medium mb-3 text-gray-900 tracking-tight"
              >
                New Arrivals
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-sm font-light text-gray-500"
              >
                Fresh styles just added
              </motion.p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {newArrivals.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 bg-gray-900 text-white">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-medium mb-5 tracking-tight">Join the UNISON Community</h2>
            <p className="text-base font-light text-gray-400 mb-10 leading-relaxed">
              Sign up now and get exclusive access to new arrivals, special offers, and more
            </p>
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="group font-light">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
