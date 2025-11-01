'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type AMLStatus = 'Fraud Detected' | 'Need Advise' | 'Success'

interface AMLTransaction {
  id: string
  date: string
  status: AMLStatus
  variables?: {
    amount?: number | string | null
    booking_jurisdiction?: string | null
    booking_datetime?: string | null
    originator_country?: string | null
    beneficiary_country?: string | null
  }
}

interface TransactionsClientProps {
  transactions: AMLTransaction[]
}

export default function TransactionsClient({ transactions }: TransactionsClientProps) {
  const [statusFilter, setStatusFilter] = useState<'All' | AMLStatus>('All')
  const [page, setPage] = useState(1)
  const perPage = 10
  const router = useRouter()

  const filteredTransactions = useMemo(() => {
    if (statusFilter === 'All') return transactions
    return transactions.filter((t) => t.status === statusFilter)
  }, [statusFilter, transactions])

  const totalPages = Math.ceil(filteredTransactions.length / perPage)
  const paginated = filteredTransactions.slice((page - 1) * perPage, page * perPage)

  const getStatusBadge = (status: AMLStatus) => {
    switch (status) {
      case 'Fraud Detected':
        return <Badge className="bg-red-100 text-red-700 border border-red-200">{status}</Badge>
      case 'Need Advise':
        return <Badge className="bg-amber-100 text-amber-700 border border-amber-200">{status}</Badge>
      case 'Success':
        return <Badge className="bg-green-100 text-green-700 border border-green-200">{status}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-4">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-zinc-800">AML Monitor</h1>
        <Link href="/aml/add">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Add Transaction
          </Button>
        </Link>
      </div>

      {/* ===== Filter Bar ===== */}
      <div className="flex gap-2">
        {['All', 'Fraud Detected', 'Need Advise', 'Success'].map((status) => (
          <Button
            key={status}
            variant="outline"
            size="sm"
            onClick={() => {
              setStatusFilter(status as any)
              setPage(1)
            }}
            className={cn(
              'text-sm',
              statusFilter === status
                ? 'bg-blue-100 border-blue-400 text-blue-700'
                : 'text-zinc-700 hover:bg-zinc-100'
            )}
          >
            {status}
          </Button>
        ))}
      </div>

      {/* ===== Transactions Table ===== */}
      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="pb-2">
          <div className="text-xs font-medium text-zinc-500">
            Showing {paginated.length} of {filteredTransactions.length} transactions
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-zinc-600">
                <th className="py-2 px-3 text-left font-medium">Transaction ID</th>
                <th className="py-2 px-3 text-left font-medium">Date Run</th>
                <th className="py-2 px-3 text-left font-medium">Status</th>
                <th className="py-2 px-3 text-left font-medium">Amount</th>
                <th className="py-2 px-3 text-left font-medium">Booking Jurisdiction</th>
                <th className="py-2 px-3 text-left font-medium">Originator</th>
                <th className="py-2 px-3 text-left font-medium">Beneficiary</th>
                <th className="w-[40px]"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => router.push(`/aml/tx/${t.id}`)}
                  className={cn(
                    'cursor-pointer border-b group transition-all',
                    'hover:bg-zinc-100 active:bg-zinc-200'
                  )}
                >
                  <td className="py-3 px-3 font-mono text-zinc-800">{t.id}</td>
                  <td className="py-3 px-3 text-zinc-700">{t.date}</td>
                  <td className="py-3 px-3">{getStatusBadge(t.status)}</td>
                  <td className="py-3 px-3 text-zinc-700">{t.variables?.amount ?? '-'}</td>
                  <td className="py-3 px-3 text-zinc-700">{t.variables?.booking_jurisdiction ?? '-'}</td>
                  <td className="py-3 px-3 text-zinc-700">{t.variables?.originator_country ?? '-'}</td>
                  <td className="py-3 px-3 text-zinc-700">{t.variables?.beneficiary_country ?? '-'}</td>
                  <td className="py-3 px-3 text-right">
                    {/* ✨ Chevron animates to the right on hover */}
                    <ChevronRight
                      className="w-4 h-4 text-zinc-400 transition-transform duration-200 ease-in-out group-hover:translate-x-1"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ===== Pagination ===== */}
      <div className="flex justify-end items-center gap-3 text-sm text-zinc-600">
        <Button
          variant="outline"
          size="icon"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="h-7 w-7"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="h-7 w-7"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
