'use client'

import React, { useState, useCallback, useEffect } from 'react';
import {PageLayout} from '@/components/layout/page-layout';

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 600;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);

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

  return (
      <div className="flex w-full h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div 
          className="flex-none bg-white border-r relative"
          style={{ width: sidebarWidth }}
        >
          <div className="p-4">
            <h2 className="text-xl font-semibold">Dashboard</h2>
          </div>
          <nav className="mt-4">
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Overview
            </div>
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Reports
            </div>
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Settings
            </div>
          </nav>

          {/* Resize Handle */}
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-gray-300 active:bg-gray-400"
            onMouseDown={startResizing}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-50 overflow-auto">
          {children}
        </main>
      </div>
  );
};

export default DashboardLayout;