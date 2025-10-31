"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, User, Search, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent"
            >
              UNISON
            </motion.div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Shop All
            </Link>
            <Link href="/products?category=T-Shirts" className="text-sm font-medium hover:text-gray-600 transition-colors">
              T-Shirts
            </Link>
            <Link href="/products?category=Jeans" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Jeans
            </Link>
            <Link href="/products?category=Hoodies" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Hoodies
            </Link>
            <Link href="/products?category=Jackets" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Jackets
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {user ? (
              <>
                <Link href="/wishlist">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                  >
                    <Heart className="w-5 h-5" />
                    {wishlistCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        {wishlistCount}
                      </motion.span>
                    )}
                  </motion.button>
                </Link>

                <Link href="/cart">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </motion.button>
                </Link>

                <Link href="/orders">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </motion.button>
                </Link>
              </>
            ) : (
              <Link href="/auth/login">
                <Button size="sm" className="hidden md:inline-flex">
                  Sign In
                </Button>
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden pb-4"
            >
              <Input
                type="search"
                placeholder="Search for products..."
                className="w-full"
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 top-16 bg-white z-40 md:hidden"
          >
            <nav className="flex flex-col p-6 space-y-4">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium hover:text-gray-600 transition-colors"
              >
                Shop All
              </Link>
              <Link
                href="/products?category=T-Shirts"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium hover:text-gray-600 transition-colors"
              >
                T-Shirts
              </Link>
              <Link
                href="/products?category=Jeans"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium hover:text-gray-600 transition-colors"
              >
                Jeans
              </Link>
              <Link
                href="/products?category=Hoodies"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium hover:text-gray-600 transition-colors"
              >
                Hoodies
              </Link>
              <Link
                href="/products?category=Jackets"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium hover:text-gray-600 transition-colors"
              >
                Jackets
              </Link>
              {user && (
                <>
                  <Link
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium hover:text-gray-600 transition-colors"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-lg font-medium hover:text-gray-600 transition-colors text-left"
                  >
                    Sign Out
                  </button>
                </>
              )}
              {!user && (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full">Sign In</Button>
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
