'use client';

import React from 'react';

interface SkeletonPageProps {
  hasHeader?: boolean;
  hasFilters?: boolean;
  itemCount?: number;
}

export default function SkeletonPage({
  hasHeader = true,
  hasFilters = true,
  itemCount = 6,
}: SkeletonPageProps) {
  return (
    <div className="my-4 animate-pulse px-6 py-8">
      {/* Header Skeleton */}
      {hasHeader && (
        <div className="mb-8 flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-zinc-800"></div>
          <div className="flex flex-col gap-2">
            <div className="h-6 w-32 rounded-md bg-zinc-800"></div>
            <div className="h-3 w-48 rounded-md bg-zinc-900"></div>
          </div>
        </div>
      )}

      {/* Search Bar Skeleton */}
      <div className="mb-6 h-12 w-full rounded-2xl border border-zinc-800 bg-zinc-900"></div>

      {/* Filter Group Skeleton */}
      {hasFilters && (
        <div className="mb-8 flex gap-2 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 w-24 shrink-0 rounded-xl border border-zinc-800 bg-zinc-900"
            ></div>
          ))}
        </div>
      )}

      {/* List Skeleton */}
      <div className="space-y-3">
        {Array.from({ length: itemCount }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-zinc-800"></div>
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-40 rounded-md bg-zinc-800"></div>
                  <div className="h-3 w-24 rounded-md bg-zinc-900"></div>
                </div>
              </div>
              <div className="h-6 w-16 rounded-full bg-zinc-800"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
