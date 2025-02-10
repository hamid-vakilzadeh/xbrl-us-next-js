'use client'

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from '@/components/layout/page-layout';
import { useAuth } from '@/components/auth/auth-provider';

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 600;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isLoading, isAuthenticated, router]);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex w-full h-[calc(100vh-64px)]">
      <main className="flex-1 p-8 bg-gray-50 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;