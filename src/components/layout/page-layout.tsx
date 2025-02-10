interface PageLayoutProps {
    children: React.ReactNode
    className?: string
  }
  
  export function PageLayout({ children, className }: PageLayoutProps) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] w-full flex-col">
        <div className={`container mx-auto max-w-7xl flex-1 px-4 py-8 md:px-8 ${className ?? ''}`}>
          {children}
        </div>
      </div>
    )
  }