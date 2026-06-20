import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/applications" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-serif text-lg font-semibold text-white shadow-sm">
            J
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight text-ink">
            Job Application Tracker
          </span>
        </Link>
        <Link href="/applications/new" className="btn-primary">
          <span className="text-base leading-none">+</span>
          <span className="hidden sm:inline">Add Application</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>
    </header>
  );
}
