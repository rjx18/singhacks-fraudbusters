'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { X, Check, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { classNames } from '@/utils'

interface AIAssessment {
  overall_risk_score: number
  priority_level: number
  final_status: 'pass' | 'fail'
  risk_level: 'low' | 'medium' | 'high'
}

interface Review {
  approve_tx: boolean
  mark_suspicious: boolean
  reason: string
}

interface ReviewPanelProps {
  transactionId: string
  variables?: {
    assessment?: AIAssessment
    review?: Review
  }
}

export default function ReviewPanel({ transactionId, variables }: ReviewPanelProps) {
  const router = useRouter()
  const params = useSearchParams()
  const nodeParam = params.get('node')

  // --- Conditional visibility logic ---
  let assessment = variables?.assessment
  if (typeof assessment === 'string') {
    try {
      assessment = JSON.parse(assessment)
    } catch {
      assessment = undefined
    }
  }
  const review = variables?.review

  const shouldShowPanel =
    nodeParam === 'flagged' &&
    assessment?.final_status === 'fail' &&
    !review

  console.log(shouldShowPanel)

  // --- Review state ---
  const [approveTx, setApproveTx] = useState<boolean | null>(null)
  const [markSuspicious, setMarkSuspicious] = useState<boolean | null>(null)
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // --- Close handler ---
  const handleClose = () => {
    const newParams = new URLSearchParams(params.toString())
    newParams.delete('node')
    router.push(`?${newParams.toString()}`)
  }

  // --- Submit handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (approveTx === null) {
      toast.error('Please select whether to approve the transaction.')
      return
    }
    if (!approveTx) {
      if (markSuspicious === null) {
        toast.error('Please select whether to mark as suspicious.')
        return
      }
      if (!reason.trim()) {
        toast.error('Please provide a reason for rejection.')
        return
      }
    }

    setSubmitting(true)
    try {
      const res = await fetch(`/api/transactions/${transactionId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approve_tx: approveTx,
          mark_suspicious: approveTx ? false : markSuspicious,
          reason: approveTx ? 'Transaction approved by reviewer.' : reason,
        }),
      })

      if (!res.ok) throw new Error('Failed to submit review')
      router.push(`/aml/tx/${transactionId}`)
    } catch (err) {
      console.error(err)
      toast.error('Error submitting review.')
    } finally {
      setSubmitting(false)
    }
  }

  // --- Button style ---
  const buttonStyle = (selected: boolean) =>
    classNames(
      'flex-1 py-2 px-3 text-sm font-medium rounded-md border transition-all duration-150',
      selected
        ? 'bg-blue-50 border-blue-600 text-blue-700'
        : 'bg-zinc-50 border-zinc-300 text-zinc-700 hover:bg-zinc-100'
    )

  if (!shouldShowPanel) return null

  // --- Render ---
  return (
    <Card className="fixed right-4 top-4 bottom-4 w-[420px] overflow-y-auto shadow-2xl border border-zinc-200 bg-white/95 backdrop-blur-sm z-[9999] p-4">
      {/* ===== Header ===== */}
      <CardHeader className="relative pb-3">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-700 transition"
          aria-label="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
        <CardTitle className="text-base font-semibold text-zinc-800">
          Transaction Review
        </CardTitle>
        <p className="text-xs text-zinc-500 mt-1">
          Please record your decision and reasoning for this transaction.
        </p>
      </CardHeader>

      {/* ===== Form ===== */}
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          {/* Approve Transaction */}
          <div>
            <Label className="text-sm font-medium text-zinc-800 mb-2 block">
              Approve transaction?
            </Label>
            <div className="flex gap-2">
              <button
                type="button"
                className={buttonStyle(approveTx === true)}
                onClick={() => {
                  setApproveTx(true)
                  setMarkSuspicious(false)
                  setReason('')
                }}
              >
                <Check className="w-4 h-4 mr-1 inline" /> Yes
              </button>
              <button
                type="button"
                className={buttonStyle(approveTx === false)}
                onClick={() => setApproveTx(false)}
              >
                <XCircle className="w-4 h-4 mr-1 inline" /> No
              </button>
            </div>
          </div>

          {/* Mark Suspicious */}
          {!approveTx && approveTx !== null && (
            <div>
              <Label className="text-sm font-medium text-zinc-800 mb-2 block">
                Mark as suspicious?
              </Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={buttonStyle(markSuspicious === true)}
                  onClick={() => setMarkSuspicious(true)}
                >
                  <Check className="w-4 h-4 mr-1 inline" /> Yes
                </button>
                <button
                  type="button"
                  className={buttonStyle(markSuspicious === false)}
                  onClick={() => setMarkSuspicious(false)}
                >
                  <XCircle className="w-4 h-4 mr-1 inline" /> No
                </button>
              </div>
            </div>
          )}

          {/* Reason */}
          {!approveTx && approveTx !== null && (
            <div>
              <Label className="text-sm font-medium text-zinc-800 mb-2 block">
                Reason for rejection
              </Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain your decision..."
                className="resize-none"
                rows={4}
                required={!approveTx}
              />
            </div>
          )}
        </CardContent>

        {/* ===== Footer ===== */}
        <CardFooter className="pt-3 flex justify-end">
          <Button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
