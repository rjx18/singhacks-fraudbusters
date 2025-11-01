'use client'
import { T } from '@/components/ui/Typography'
import Link from 'next/link'

export const ExternalNavigation = () => {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pointer-events-auto"
      style={{ height: 'auto' }}
    >
      <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center">
        <Link className="flex items-center space-x-2" href="/">
          <div className="flex items-center justify-center">
            <MountainIcon className="h-6 w-6" />
          </div>
          <T.H3 className="hidden lg:block text-xl font-semibold leading-tight mt-0">
            Dilly
          </T.H3>
          <T.H3 className="block lg:hidden text-xl font-semibold leading-tight mt-0">
            Dilly
          </T.H3>
        </Link>
      </div>
    </header>
  )
}

function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}
