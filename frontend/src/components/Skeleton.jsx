export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-2/3" />
          <div className="h-3 bg-slate-200 rounded w-1/3" />
        </div>
        <div className="space-y-1">
          <div className="h-5 bg-slate-200 rounded w-14" />
          <div className="h-3 bg-slate-200 rounded w-10" />
        </div>
      </div>
      <div className="flex gap-1.5 mt-3">
        <div className="h-6 bg-slate-200 rounded-lg w-16" />
        <div className="h-6 bg-slate-200 rounded-lg w-20" />
        <div className="h-6 bg-slate-200 rounded-lg w-14" />
      </div>
      <div className="flex justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
        <div className="h-4 bg-slate-200 rounded w-20" />
        <div className="h-4 bg-slate-200 rounded w-16" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-pulse">
      <div className="bg-slate-100 p-8">
        <div className="flex gap-6">
          <div className="w-24 h-24 rounded-2xl bg-slate-200" />
          <div className="flex-1 space-y-3">
            <div className="h-7 bg-slate-200 rounded w-48" />
            <div className="h-4 bg-slate-200 rounded w-64" />
            <div className="h-10 bg-slate-200 rounded w-44" />
          </div>
        </div>
      </div>
      <div className="p-8 space-y-4">
        <div className="h-4 bg-slate-200 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 6 }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}
