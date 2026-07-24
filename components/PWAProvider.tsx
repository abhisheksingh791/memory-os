'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Wifi, WifiOff, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PWAContextType {
  isOnline: boolean;
  isInstallable: boolean;
  promptInstall: () => void;
}

const PWAContext = createContext<PWAContextType>({
  isOnline: true,
  isInstallable: false,
  promptInstall: () => {},
});

export const usePWA = () => useContext(PWAContext);

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);

  useEffect(() => {
    // Service worker registration
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[Memory OS PWA] Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.error('[Memory OS PWA] Service Worker registration failed:', err);
        });
    }

    // Network status listeners
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // PWA Install prompt listener
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsInstallable(true);
        // Show banner after 3 seconds if not installed
        setTimeout(() => setShowInstallBanner(true), 3000);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const promptInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the Memory OS PWA install prompt');
        }
        setDeferredPrompt(null);
        setIsInstallable(false);
        setShowInstallBanner(false);
      });
    }
  };

  return (
    <PWAContext.Provider value={{ isOnline, isInstallable, promptInstall }}>
      {children}

      {/* Offline Toast Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 md:bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-red-950/90 border border-red-500/40 text-red-200 rounded-xl shadow-glass backdrop-blur-md text-sm font-medium"
          >
            <WifiOff className="w-5 h-5 text-red-400 animate-pulse" />
            <span>Offline Mode active. All data saved to local storage.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Install Banner */}
      <AnimatePresence>
        {showInstallBanner && isInstallable && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-4 left-4 md:left-auto md:w-96 z-50 p-4 bg-zinc-900/90 border border-indigo-500/30 rounded-2xl shadow-glow backdrop-blur-xl text-zinc-100 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Install Memory OS</h4>
                  <p className="text-xs text-zinc-400">Add to home screen for native offline performance</p>
                </div>
              </div>
              <button
                onClick={() => setShowInstallBanner(false)}
                className="text-zinc-400 hover:text-zinc-100 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowInstallBanner(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800"
              >
                Maybe Later
              </button>
              <button
                onClick={promptInstall}
                className="px-4 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-sm transition-all"
              >
                Install Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PWAContext.Provider>
  );
}
