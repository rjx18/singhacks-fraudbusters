'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { AML_RULE_DESCRIPTIONS } from '@/constants/checks'
import ReactMarkdown from 'react-markdown'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ExternalLink, X } from 'lucide-react'

// Jurisdiction logos
const jurisdictionLogos: Record<string, string> = {
  'MAS (Singapore)': '/logos/mas.svg',
  'HKMA (Hong Kong)': '/logos/hkma.svg',
  'FINMA (Switzerland)': '/logos/finma.svg',
  'SFC (Hong Kong)': '/logos/sfc.svg',
  'SECO (Switzerland)': '/logos/seco.svg',
  'FATF': '/logos/fatf.svg',
  'UN': '/logos/un.svg',
  'EU': '/logos/eu.svg',
}

interface InfoPanelProps {
  variables?: Record<string, any>
}

export default function InfoPanel({ variables }: InfoPanelProps) {
  const router = useRouter()
  const params = useSearchParams()
  const ruleId = params.get('rule')
  const rule = ruleId ? AML_RULE_DESCRIPTIONS[ruleId] : null

  // If no rule selected and no variables → don’t render
  if (!rule) return null

  const handleClose = () => {
    const newParams = new URLSearchParams(params.toString())
    newParams.delete('rule')
    router.push(`?${newParams.toString()}`)
  }

  // Extract main transaction details if available
  const txnData = variables?.data ?? null
  const hasTxnData = txnData && typeof txnData === 'object'

  return (
    <Card className="fixed right-4 top-4 bottom-4 w-[420px] overflow-y-auto shadow-2xl border border-zinc-200 bg-white/95 backdrop-blur-sm z-[9999] p-4">
      {/* ====== Header ====== */}
      <CardHeader className="relative pb-3">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-700 transition"
          aria-label="Close panel"
        >
          <X className="w-4 h-4" />
        </button>

        {rule && (
          <>
            <div className="flex flex-wrap gap-2 mb-2">
              {rule.jurisdictions.map((jur) => (
                <Badge
                  key={jur}
                  className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200"
                >
                  {jurisdictionLogos[jur] && (
                    <img
                      src={jurisdictionLogos[jur]}
                      alt={jur}
                      className="w-3.5 h-3.5"
                    />
                  )}
                  {jur}
                </Badge>
              ))}
              <Badge className="bg-purple-50 text-purple-700 border border-purple-200">
                {rule.category}
              </Badge>
            </div>

            <CardTitle className="text-base font-semibold text-zinc-800 leading-snug">
              {rule.title}
            </CardTitle>
          </>
        )}
      </CardHeader>

      {/* ====== Rule Content ====== */}
      {rule && (
        <CardContent className="prose prose-sm max-w-none text-zinc-700">
          <ReactMarkdown
            components={{
              code({ children }) {
                return (
                  <code className="px-1.5 py-0.5 rounded bg-zinc-100 text-amber-700 font-mono text-[0.8rem]">
                    {children}
                  </code>
                )
              },
              strong({ children }) {
                return <strong className="text-zinc-900 font-semibold">{children}</strong>
              },
              em({ children }) {
                return <em className="text-zinc-600 italic">{children}</em>
              },
              p({ children }) {
                return <p className="mb-2 text-[0.85rem] leading-relaxed">{children}</p>
              },
            }}
          >
            {rule.description}
          </ReactMarkdown>

          {/* ====== References ====== */}
          {rule.references?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {rule.references.map((ref) => (
                <a
                  key={ref.url}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-600 text-xs px-2 py-1 rounded-full border border-zinc-200 hover:bg-zinc-200 transition"
                >
                  {ref.label}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          )}
        </CardContent>
      )}

      {/* ====== Transaction Variables ====== */}
      {hasTxnData && (
        <CardContent className="mt-4 border-t border-zinc-200 pt-3 text-[0.85rem]">
          <h3 className="text-sm font-semibold text-zinc-800 mb-2">Transaction Details</h3>

          <div className="space-y-1 text-zinc-700">
            <div><strong>ID:</strong> {txnData.transaction_id}</div>
            <div><strong>Booking Jurisdiction:</strong> {txnData.booking_jurisdiction}</div>
            <div><strong>Regulator:</strong> {txnData.regulator}</div>
            <div><strong>Amount:</strong> {txnData.amount?.toLocaleString()} {txnData.currency}</div>
            <div><strong>Channel:</strong> {txnData.channel}</div>
            <div><strong>Originator Country:</strong> {txnData.originator_country}</div>
            <div><strong>Beneficiary Country:</strong> {txnData.beneficiary_country}</div>
            <div><strong>Booking Datetime:</strong> {txnData.booking_datetime}</div>
          </div>

          {/* Optional: a collapsible advanced view */}
          <details className="mt-3">
            <summary className="cursor-pointer text-sm text-blue-600 hover:underline">
              Show all fields
            </summary>
            <pre className="mt-2 bg-zinc-50 border border-zinc-200 rounded p-2 text-xs overflow-x-auto">
              {JSON.stringify(txnData, null, 2)}
            </pre>
          </details>
        </CardContent>
      )}
    </Card>
  )
}
