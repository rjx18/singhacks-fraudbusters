'use client'

import { useEffect, useState } from 'react'
import TransactionsClient from './AMLTransactionList'
import { SkeletonTransactionTable } from './AMLTransactionListSkeleton'

async function fetchTransactions(after?: string, before?: string) {
  const params = new URLSearchParams()
  if (after) params.set('after', after)
  if (before) params.set('before', before)

  const res = await fetch(`/api/transactions?${params.toString()}`, {
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`Failed to fetch transactions: ${res.status}`)

  const data = await res.json()
  if (!data.success) throw new Error(data.error || 'Failed to fetch transactions')

  const { page, items } = data

  console.log(data)

  const transactions = items.map((t: any) => {
    const variables = t.variables || []
    const variableMap: Record<string, any> = {}

    for (const v of variables) {
      try {
        variableMap[v.name] = typeof v.value === 'string' ? JSON.parse(v.value) : v.value
      } catch {
        variableMap[v.name] = v.value
      }
    }

    const dataObj = variableMap['data'] || {}
    const nonDeterministic = variableMap['non_deterministic_tests'] || {}

    const allSections = Object.keys(variableMap).filter(
      (key) =>
        !['data', 'non_deterministic_tests', 'error'].includes(key) &&
        typeof variableMap[key] === 'object'
    )

    const testResults: Record<string, string> = {}
    const sectionStatuses: Record<string, string> = {}

    for (const section of allSections) {
      const s = variableMap[section]
      if (s?.tests) {
        for (const [testId, val] of Object.entries(s.tests)) {
          testResults[testId] = val === true ? 'pass' : 'fail'
        }
      }
      if (s?.overall_status) sectionStatuses[section] = s.overall_status
    }

    for (const [testId, obj] of Object.entries(nonDeterministic)) {
      if (obj && typeof obj === 'object' && 'status' in obj) {
        testResults[testId] = obj.status as any
      }
    }

    const ruleHits = Object.entries(testResults)
      .filter(([_, status]) => status === 'fail')
      .map(([ruleId]) => ruleId)
      .sort()

    const hasFail = ruleHits.length > 0
    const hasNeedsAdvice = Object.values(sectionStatuses).some((v) => v === 'needs_advice')

    const status: 'Fraud Detected' | 'Need Advise' | 'Success' =
      hasFail ? 'Fraud Detected' : hasNeedsAdvice ? 'Need Advise' : 'Success'

    return {
      id: t.processInstanceKey || t.id,
      date: t.startDate || new Date().toISOString(),
      status,
      variables: {
        amount: dataObj.amount ?? null,
        booking_jurisdiction: dataObj.booking_jurisdiction ?? null,
        booking_datetime: dataObj.booking_datetime ?? null,
        regulator: dataObj.regulator ?? null,
        originator_country: dataObj.originator_country ?? null,
        beneficiary_country: dataObj.beneficiary_country ?? null,
        customer_risk_rating: dataObj.customer_risk_rating ?? null,
        flags: dataObj.customer_is_pep ? ['PEP'] : [],
        rule_hits: ruleHits,
      },
    }
  })

  return {
    transactions,
    pagination: {
      totalItems: page.totalItems,
      hasMore: page.hasMoreTotalItems,
      startCursor: page.startCursor,
      endCursor: page.endCursor,
    },
  }
}

export default function TransactionsContent() {
  const [data, setData] = useState<{ transactions: any[]; pagination: any } | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadPage(after?: string, before?: string) {
    setLoading(true)
    try {
      const newData = await fetchTransactions(after, before)
      setData(newData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPage()
  }, [])

  if (loading || !data) return <SkeletonTransactionTable />

  return (
    <TransactionsClient
      transactions={data.transactions}
      pagination={data.pagination}
      onNextPage={() => loadPage(data.pagination.endCursor)}
      onPrevPage={() => loadPage(undefined, data.pagination.startCursor)}
    />
  )
}
