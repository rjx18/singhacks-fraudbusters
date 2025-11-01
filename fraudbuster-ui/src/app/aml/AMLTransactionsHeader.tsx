'use client'

import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import AddTransactionDialog from './AddTransactionDialog'

export default function TransactionsHeader() {
  const [search, setSearch] = useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* === Left Section === */}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-semibold text-zinc-800">Transactions</h1>
          <span className="text-xs text-neutral-500">Team</span>
          <select
            className="rounded-xl border border-neutral-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#002B45]"
            defaultValue="Compliance"
          >
            <option>Compliance</option>
            <option>Audit</option>
            <option>Risk</option>
          </select>
        </div>

        {/* === Right Section === */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by ID, client, or rule..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-72 rounded-2xl border border-neutral-200 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#002B45]"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">
              ⌘K
            </span>
          </div>

          <button
            onClick={() => console.log('Export CSV')}
            className="rounded-2xl border border-neutral-300 px-3 py-2 text-sm bg-white hover:bg-neutral-50 transition"
          >
            Export CSV
          </button>

          <AddTransactionDialog />
        </div>
      </div>
    </div>
  )
}
