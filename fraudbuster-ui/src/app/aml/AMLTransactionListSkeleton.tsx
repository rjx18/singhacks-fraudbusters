// app/(dashboard)/aml/TransactionsSkeleton.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonTransactionTable() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-8 w-24" />
        ))}
      </div>
      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-10 bg-zinc-100 rounded-md border border-zinc-200"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
