import { Suspense } from 'react'
import TransactionsContent from './AMLTransactionsContent'
import { SkeletonTransactionTable } from './AMLTransactionListSkeleton'

export default function AMLTransactionsPage() {
  return (
    <Suspense fallback={<SkeletonTransactionTable />}>
      <TransactionsContent />
    </Suspense>
  )
}
