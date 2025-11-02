'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Lightbulb, X, AlertTriangle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import remarkGfm from 'remark-gfm'

interface AIReportPanelProps {
  variables?: Record<string, any>
}

export default function AIReportPanel({ variables }: AIReportPanelProps) {
  const router = useRouter()
  const params = useSearchParams()
  const node = params.get('node')

  const [showFullReport, setShowFullReport] = useState(false)

  const handleClose = () => {
    const newParams = new URLSearchParams(params.toString())
    newParams.delete('node')
    router.push(`?${newParams.toString()}`)
  }

  const parseSafe = (v: any) => {
    try {
      return typeof v === 'string' ? JSON.parse(v) : v
    } catch {
      return null
    }
  }

  const assessment = parseSafe(variables?.assessment)
  const data = parseSafe(variables?.data)

  if (node !== 'ai') return null

  return (
    <>
      <Card className="fixed right-4 top-4 bottom-4 w-[480px] overflow-y-auto shadow-2xl border border-zinc-200 bg-white backdrop-blur-sm z-40 p-5">
        <CardHeader className="relative pb-3 border-b border-zinc-200">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-700 transition"
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-zinc-800">
              AI Compliance Report
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 rounded-full border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100"
              onClick={() => setShowFullReport(true)}
            >
              <FileText className="w-4 h-4" />
              View full report
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-6 text-sm text-zinc-700">
          {/* ===== Assessment Summary ===== */}
          {assessment && (
            <section>
              <h3 className="font-semibold text-zinc-900 mb-3 uppercase tracking-wide text-xs">
                Assessment Summary
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Final Status', value: assessment.final_status?.toUpperCase() },
                  { label: 'Risk Rating', value: assessment.risk_rating },
                  { label: 'Overall Risk Score', value: assessment.overall_risk_score },
                  { label: 'Priority Level', value: assessment.priority_label },
                  {
                    label: 'Recommended Action',
                    value: assessment.recommended_action,
                    full: true,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex flex-col rounded-lg border border-blue-200 bg-blue-50 px-3 py-2',
                      item.full && 'col-span-2'
                    )}
                  >
                    <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wide mb-1">
                      {item.label}
                    </span>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        item.label === 'Final Status' &&
                          (assessment.final_status === 'fail'
                            ? 'text-red-600'
                            : 'text-green-700')
                      )}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ===== Transaction Details ===== */}
          {data && (
            <section>
              <h3 className="font-semibold text-zinc-900 mb-3 uppercase tracking-wide text-xs">
                Transaction Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'ID', value: data.transaction_id },
                  { label: 'Jurisdiction', value: data.booking_jurisdiction },
                  { label: 'Regulator', value: data.regulator },
                  {
                    label: 'Amount',
                    value: `${data.amount?.toLocaleString()} ${data.currency}`,
                  },
                  { label: 'Channel', value: data.channel },
                  { label: 'Type', value: data.product_type },
                  { label: 'Originator', value: data.originator_name },
                  { label: 'Beneficiary', value: data.beneficiary_name },
                  {
                    label: 'Countries',
                    value: `${data.originator_country} → ${data.beneficiary_country}`,
                  },
                  { label: 'Booking Date', value: data.booking_datetime },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[11px] font-semibold text-zinc-600 uppercase mb-1">
                      {item.label}
                    </span>
                    <span className="text-sm text-zinc-800 font-medium break-all">
                      {item.value || '-'}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ===== Key Findings ===== */}
          {assessment?.findings_summary && (
            <section className="border border-blue-200 bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-blue-700" />
                <h3 className="font-semibold text-blue-800 text-sm">Key Findings</h3>
              </div>
              <ul className="list-disc list-inside space-y-1 text-blue-900 text-sm">
                {assessment.findings_summary.deterministic_violations?.map(
                  (f: any, i: number) => (
                    <li key={i}>
                      <span className="font-semibold text-blue-800">
                        [{f.rule_id}] {f.authority}:
                      </span>{' '}
                      {f.finding}
                    </li>
                  )
                )}
              </ul>
            </section>
          )}

          {/* ===== Recommended Actions ===== */}
          {assessment?.specific_requests?.length > 0 && (
            <section className="border border-green-200 bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-green-700" />
                <h3 className="font-semibold text-green-800 text-sm">
                  Recommended Actions
                </h3>
              </div>
              <ul className="list-disc list-inside space-y-1 text-green-900 text-sm">
                {assessment.specific_requests.map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </section>
          )}
        </CardContent>
      </Card>

      {/* ===== Modal ===== */}
      <Dialog open={showFullReport} onOpenChange={setShowFullReport}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto z-[9999]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-800">
              <FileText className="w-5 h-5 text-blue-700" />
              Full AI Report
            </DialogTitle>
          </DialogHeader>

            <div className="prose prose-sm max-w-none text-zinc-800 
              prose-headings:text-zinc-900 
              prose-strong:text-zinc-900 
              prose-code:bg-zinc-100 
              prose-code:px-1.5 prose-code:py-0.5 
              prose-code:rounded prose-code:text-amber-700 
              prose-table:border-collapse prose-th:text-left 
              prose-tr:even:bg-zinc-50 prose-td:align-top
              [&_table]:w-full 
              [&_table]:border 
              [&_table]:border-zinc-200 
              [&_table]:rounded-xl 
              [&_thead_th]:bg-zinc-100 
              [&_thead_th]:text-zinc-700 
              [&_thead_th]:font-semibold 
              [&_thead_th]:px-4 
              [&_thead_th]:py-2 
              [&_tbody_td]:border-t 
              [&_tbody_td]:border-zinc-200 
              [&_tbody_td]:px-4 
              [&_tbody_td]:py-2 
              [&_tbody_tr:last-child_td]:border-b-0 
              [&_table]:overflow-hidden 
              [&_table]:shadow-sm">

              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {variables?.report
                  ? variables.report
                      .replace(/^"+|"+$/g, '') // remove outer quotes
                      .replace(/\\n/g, '\n')   // convert literal \n into real line breaks
                  : '_No report content available._'}
              </ReactMarkdown>
            </div>

        </DialogContent>
      </Dialog>
    </>
  )
}
