'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, ChevronRightIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import AddTransactionDialog from './AddTransactionDialog'
import TransactionsHeader from './AMLTransactionsHeader'

type AMLStatus = 'In Progress' | 'Need Advice' | 'Success'

interface AMLTransaction {
  id: string
  date: string
  regulator: string
  state: string
  status: AMLStatus
  variables?: {
    amount?: number | string | null
    booking_jurisdiction?: string | null
    booking_datetime?: string | null
    originator_country?: string | null
    beneficiary_country?: string | null
    flags?: string[]
    rule_hits?: string[]
    regulator?: string
  }
}

interface TransactionsClientProps {
  transactions: AMLTransaction[]
  pagination?: {
    totalItems: number
    hasMore: boolean
    startCursor?: string
    endCursor?: string
  }
  onNextPage?: () => void
  onPrevPage?: () => void
}

export default function TransactionsClient({ transactions, pagination, onNextPage, onPrevPage }: TransactionsClientProps) {
  const router = useRouter()

  // ===== Filters =====
  const [jurisdiction, setJurisdiction] = useState('All')
  const [statusFilter, setStatusFilter] = useState<'All' | AMLStatus>('All')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [amountMin, setAmountMin] = useState('')
  const [selected, setSelected] = useState<string[]>([])

  // ===== Derived Data =====
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const amount = Number(t.variables?.amount ?? 0)
      const date = new Date(t.variables?.booking_datetime ?? t.date)
      if (jurisdiction !== 'All' && t.variables?.booking_jurisdiction !== jurisdiction) return false
      if (statusFilter !== 'All' && t.status !== statusFilter) return false
      if (amountMin && amount < Number(amountMin)) return false
      if (
        dateRange?.from &&
        dateRange?.to &&
        (date < dateRange.from || date > dateRange.to)
      )
        return false
      return true
    })
  }, [transactions, jurisdiction, statusFilter, dateRange, amountMin])

  const statusStyles: Record<string, string> = {
    ACTIVE: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    COMPLETED: "bg-green-100 text-green-800 border border-green-200",
    TERMINATED: "bg-zinc-100 text-zinc-700 border border-zinc-200",
  };

  // ===== Selection =====
  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = (checked: boolean) => {
    if (checked) setSelected(filtered.map((t) => t.id))
    else setSelected([])
  }

  // ===== Status Colors =====
  const getStatusBadge = (status: AMLStatus) => {
    switch (status) {
      case 'Need Advice':
        return <Badge className="bg-red-100 text-red-700 border border-red-200">Needs Review</Badge>
      case 'In Progress':
        return <Badge className="bg-amber-100 text-amber-700 border border-amber-200">In Progress</Badge>
      case 'Success':
        return <Badge className="bg-green-100 text-green-700 border border-green-200">Cleared</Badge>
    }
  }

  return (
    <div>
      <TransactionsHeader />
      <div className="p-6 space-y-4">

        {/* ===== Filter Bar ===== */}
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={jurisdiction} onValueChange={setJurisdiction}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Jurisdiction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {[...new Set(transactions.map((t) => t.variables?.booking_jurisdiction))].map(
                (j) => (
                  <SelectItem key={j ?? 'Unknown'} value={j ?? 'Unknown'}>
                    {j ?? 'Unknown'}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as any)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Fraud Detected">Fraud Detected</SelectItem>
              <SelectItem value="Need Advise">Need Advise</SelectItem>
              <SelectItem value="Success">Success</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Amount ≥"
            value={amountMin}
            onChange={(e) => setAmountMin(e.target.value)}
            className="w-[120px]"
          />
        </div>

        {/* ===== Selection Toolbar ===== */}
        {selected.length > 0 && (
          <div className="flex justify-between items-center rounded-md border p-2 bg-zinc-50 text-sm">
            <div>{selected.length} selected</div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">Assign</Button>
              <Button variant="secondary" size="sm">Mark Reviewed</Button>
              <Button variant="secondary" size="sm">Open in Case</Button>
            </div>
          </div>
        )}

        {/* ===== Transactions Table ===== */}
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="overflow-x-auto p-0">
            <table className="min-w-full text-[13px] border-collapse">
              <thead className="bg-zinc-50 border-b text-zinc-500 font-semibold">
                <tr>
                  <th className="py-2 px-3">
                    <Checkbox
                      checked={selected.length === filtered.length && filtered.length > 0}
                      onCheckedChange={(v) => toggleSelectAll(!!v)}
                    />
                  </th>
                  <th className="py-2 px-3 text-left">ID / Time</th>
                  <th className="py-2 px-3 text-left">Client</th>
                  <th className="py-2 px-3 text-left">Amount</th>
                  <th className="py-2 px-3 text-left">Jurisdiction</th>
                  <th className="py-2 px-3 text-left">Regulator</th>
                  <th className="py-2 px-3 text-left">Flags</th>
                  <th className="py-2 px-3 text-left">Rule Hits</th>
                  <th className="py-2 px-3 text-left">Status</th>
                  <th className="py-2 px-3 text-left">Result</th>
                  <th className="py-2 px-3 text-right"></th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((t) => (
                  <tr
                    key={t.id}
                    className={cn(
                      'border-b transition hover:bg-zinc-50',
                      selected.includes(t.id) && 'bg-blue-50'
                    )}
                  >
                    <td className="py-2 px-3">
                      <Checkbox
                        checked={selected.includes(t.id)}
                        onCheckedChange={() => toggleSelect(t.id)}
                      />
                    </td>
                    <td className="py-2 px-3 font-mono text-[12px]">
                      {t.id}
                      <div className="text-xs text-zinc-500">{t.date}</div>
                    </td>
                    <td className="py-2 px-3">{t.variables?.originator_country ?? '-'}</td>
                    <td className="py-2 px-3">
                      {t.variables?.amount
                        ? Number(t.variables.amount).toLocaleString()
                        : '-'}
                    </td>
                    <td className="py-2 px-3">{t.variables?.booking_jurisdiction ?? '-'}</td>
                    <td className="py-2 px-3">{t.variables?.regulator ?? '—'}</td>
                    <td className="py-2 px-3">
                      {t.variables?.flags?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {t.variables.flags.map((flag) => (
                            <Badge
                              key={flag}
                              className="bg-red-100 text-red-700 border border-red-200 text-[11px]"
                            >
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>

                    <td className="py-2 px-3">
                      {t.variables?.rule_hits?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {[...t.variables.rule_hits]
                            .sort((a, b) => a.localeCompare(b))
                            .map((hit) => (
                              <Badge
                                key={hit}
                                className="bg-blue-100 text-blue-700 border border-blue-200 text-[11px]"
                              >
                                {hit}
                              </Badge>
                            ))}
                        </div>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      {t.state && (
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            statusStyles[t.state] || "bg-zinc-50 text-zinc-500 border border-zinc-200"
                          }`}
                        >
                          {t.state.charAt(0).toUpperCase() + t.state.slice(1).toLowerCase()}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3">{getStatusBadge(t.status)}</td>
                    <td className="py-2 px-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => router.push(`/aml/tx/${t.id}`)}
                        className="text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 border"
                      >
                        Details
                        <ChevronRightIcon />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* ===== Pagination ===== */}
        {pagination && (
          <div className="flex justify-end items-center gap-3 text-sm text-zinc-600">
            <Button
              variant="outline"
              size="icon"
              disabled={!pagination.startCursor}
              onClick={onPrevPage}
              className="h-7 w-7"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <span>
              Showing {transactions.length} of {pagination.totalItems}
            </span>

            <Button
              variant="outline"
              size="icon"
              disabled={!pagination.endCursor}
              onClick={onNextPage}
              className="h-7 w-7"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
