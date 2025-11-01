'use client'

import React from 'react'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Clipboard, Database } from 'lucide-react'

interface DataPanelProps {
  variables?: Record<string, any>
}

export default function DataPanel({ variables }: DataPanelProps) {
  if (!variables?.data) return null

  let parsedData: Record<string, any> = {}
  try {
    parsedData =
      typeof variables.data === 'string'
        ? JSON.parse(variables.data)
        : variables.data
  } catch (err) {
    console.warn('[DataPanel] Failed to parse variables.data:', err)
  }

  const entries = Object.entries(parsedData)

  return (
    <aside className="fixed left-64 top-0 h-screen w-80 border-r border-zinc-200 bg-white/90 backdrop-blur-sm z-40 flex flex-col">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-200 bg-zinc-50">
        <Database className="w-3.5 h-3.5 text-blue-700" />
        <h2 className="text-xs font-semibold text-zinc-800">Transaction Data</h2>
      </div>

      {/* ===== Scrollable Table ===== */}
      <div className="flex-1 overflow-auto">
        <div className="p-2 min-w-full">
          <div className="border border-zinc-100 rounded-lg shadow-sm overflow-x-auto">
            <div className="min-w-[400px]">
              <Table className="w-full text-[11px] table-auto">
                <TableBody>
                  {entries.map(([key, value]) => (
                    <TableRow
                      key={key}
                      className="hover:bg-zinc-50 transition-colors"
                    >
                      <TableCell className="font-medium text-zinc-700 border-r border-zinc-100 align-top whitespace-nowrap px-2 py-1 w-[40%]">
                        {key}
                      </TableCell>
                      <TableCell className="text-zinc-600 text-[10.5px] px-2 py-1 whitespace-nowrap">
                        {typeof value === 'object'
                          ? JSON.stringify(value)
                          : String(value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Footer ===== */}
      <div className="p-2 border-t border-zinc-200 bg-zinc-50 flex justify-end">
        <button
          onClick={() =>
            navigator.clipboard.writeText(JSON.stringify(parsedData, null, 2))
          }
          className="flex items-center gap-1 text-[10.5px] text-blue-700 hover:underline"
        >
          <Clipboard className="w-3 h-3" /> Copy JSON
        </button>
      </div>
    </aside>
  )
}
