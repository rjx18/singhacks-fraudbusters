'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { classNames } from '@/utils'
import Link from 'next/link'

const NAV_PATHS = {
  dashboard: '/dashboard',
  transactions: '/aml',
  documents: '/document',
  rules: '/rules',
  audit: '/audit',
}

const TEAMS = ['Compliance', 'Audit', 'Risk']
const COMPANIES = [
  { name: 'Müller AG', code: 'P-8842', country: 'CH', owner: 'John Wong' },
  { name: 'Kai Tak Holdings', code: 'P-7710', country: 'HK', owner: 'Amy Lee' },
  { name: 'Lion City Ventures', code: 'P-6601', country: 'SG', owner: 'G. Tan' },
]

// Dilly mountain icon
function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const [team, setTeam] = useState('Compliance')
  const [prospectSearch, setProspectSearch] = useState('')

  const isActive = (path: string) => pathname.startsWith(path)

  return (
    <aside className="flex flex-col justify-between h-screen w-64 border-r bg-white">
      <div className="flex flex-col h-full px-4 pt-4 pb-6 overflow-y-auto">
        {/* === Dilly Logo (new) === */}

        {/* === Existing Header (kept) === */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800 text-white font-semibold">
            JB
          </div>
          <div>
            <div className="text-xs text-zinc-500">Agentic AML</div>
            <div className="font-semibold text-sm text-zinc-800">Monitoring Suite</div>
          </div>
        </div>

        {/* === Navigation === */}
        <nav className="flex flex-col gap-1">
          {[
            { name: 'Dashboard', path: NAV_PATHS.dashboard },
            { name: 'Transactions', path: NAV_PATHS.transactions },
            { name: 'Documents', path: NAV_PATHS.documents },
            { name: 'Rules', path: NAV_PATHS.rules },
            { name: 'Audit Trail', path: NAV_PATHS.audit },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={classNames(
                'text-left rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive(item.path)
                  ? 'bg-blue-900 text-white'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
              )}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* === Dynamic: Transactions === */}
        {isActive(NAV_PATHS.transactions) && (
          <div className="mt-6 space-y-3">
            <label className="text-xs text-zinc-500 font-medium">Team</label>
            <div className="relative">
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full rounded-md border border-zinc-300 text-sm py-1.5 pl-3 pr-8 bg-white focus:ring-1 focus:ring-blue-500"
              >
                {TEAMS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>
        )}

        {/* === Dynamic: Documents === */}
        {isActive(NAV_PATHS.documents) && (
          <div className="mt-6 space-y-3">
            <label className="text-xs text-zinc-500 font-medium">Prospect</label>
            <input
              type="text"
              placeholder="Search prospect..."
              value={prospectSearch}
              onChange={(e) => setProspectSearch(e.target.value)}
              className="w-full rounded-md border border-zinc-300 text-sm py-1.5 px-3 bg-white focus:ring-1 focus:ring-blue-500"
            />
            <div className="mt-3 flex flex-col gap-1 max-h-[250px] overflow-y-auto">
              {COMPANIES.filter((c) =>
                c.name.toLowerCase().includes(prospectSearch.toLowerCase())
              ).map((c) => (
                <button
                  key={c.code}
                  className="text-left text-xs px-3 py-2 rounded-md hover:bg-zinc-100 transition"
                  onClick={() => router.push(`${NAV_PATHS.documents}/${c.code}`)}
                >
                  <div className="font-semibold text-zinc-900">{c.name}</div>
                  <div className="text-zinc-500 text-[11px]">
                    {c.code} · {c.country} · Owner: {c.owner}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* === Footer === */}
      <div className="p-4 border-t">
        <div className="text-center mb-3">
          <span className="text-xs font-semibold bg-zinc-900 text-white px-3 py-1 rounded-full">
            Demo Mode
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-200 text-zinc-700 text-xs font-semibold">
            JW
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-800">John Wong</div>
            <div className="text-xs text-zinc-500">Compliance</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
