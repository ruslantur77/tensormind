import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/widgets/header/Header';
import { BottomNav } from '@/widgets/nav/BottomNav';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col transition-colors relative overflow-x-hidden bg-[var(--tm-bg)] text-[var(--tm-text-primary)]">
      <Header />
      {/* Generous bottom padding (pb-44 on mobile) so cards/buttons are never obscured by BottomNav */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-4 sm:py-6 pb-44 sm:pb-32">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
