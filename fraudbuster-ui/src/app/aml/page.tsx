import { Suspense } from 'react'
import TransactionsClient from './AMLTransactionList'
import { SkeletonTransactionTable } from './AMLTransactionListSkeleton'

async function fetchTransactions() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transactions`, {
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)

  const data = await res.json()
  if (!data.success) throw new Error(data.error || 'Failed to fetch transactions')

  return data.transactions.map((t: any) => {
    // Default variable extraction
    const variables = t.variables || []
    const dataVar = variables.find((v: any) => v.name === 'data')
    let dataObj: any = {}

    // Try to parse `data.value` if it's JSON
    if (dataVar && dataVar.value) {
      try {
        dataObj = JSON.parse(dataVar.value)
      } catch {
        console.warn('Invalid JSON in variable.data:', dataVar.value)
      }
    }

    return {
      id: t.processInstanceKey || t.id,
      date: t.startDate || new Date().toISOString().slice(0, 10),
      status:
        t.state === 'ACTIVE'
          ? 'Need Advise'
          : t.state === 'COMPLETED'
          ? 'Success'
          : 'Fraud Detected',
      variables: {
        amount: dataObj.amount ?? null,
        booking_jurisdiction: dataObj.booking_jurisdiction ?? null,
        booking_datetime: dataObj.booking_datetime ?? null,
        originator_country: dataObj.originator_country ?? null,
        beneficiary_country: dataObj.beneficiary_country ?? null,
      },
    }
  })
}

async function TransactionsContent() {
  const transactions = await fetchTransactions()
  return <TransactionsClient transactions={transactions} />
}

export default function AMLTransactionsPage() {
  return (
    <Suspense fallback={<SkeletonTransactionTable />}>
      <TransactionsContent />
    </Suspense>
  )
}
