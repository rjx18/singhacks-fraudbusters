'use client'

import { useState, useEffect } from 'react'

type AccordionProps = {
  children?: React.ReactNode
  title: React.ReactNode
  id: string,
  active?: boolean
}

export default function Accordion({
  children,
  title,
  id,
  active = false
}: AccordionProps) {

  const [accordionOpen, setAccordionOpen] = useState<boolean>(false)

  useEffect(() => {
    if (children) {
      setAccordionOpen(active)
    }
  }, [])

  return (
    <div className="py-1">
      <h2 className="pb-1">
        <button
          className="flex items-center justify-between w-full text-left text-[5pt] px-1 font-semibold"
          onClick={(e) => { e.preventDefault(); setAccordionOpen(!accordionOpen); }}
          aria-expanded={accordionOpen}
          aria-controls={`accordion-text-${id}`}
        >
          <span>{title}</span>
          {children && <svg className="fill-green-700 shrink-0 ml-1" width="6" height="6" xmlns="http://www.w3.org/2000/svg">
            <rect y="2.625" width="6" height="0.75" rx="0.375" className={`transform origin-center transition duration-200 ease-out ${accordionOpen && '!rotate-180'}`} />
            <rect y="2.625" width="6" height="0.75" rx="0.375" className={`transform origin-center rotate-90 transition duration-200 ease-out ${accordionOpen && '!rotate-180'}`} />
          </svg>}
        </button>
      </h2>
      {children && <div
        id={`accordion-text-${id}`}
        role="region"
        aria-labelledby={`accordion-title-${id}`}
        className={`grid text-[5pt] text-slate-600 overflow-hidden transition-all duration-300 ease-in-out ${accordionOpen ? 'pt-1 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden" onClick={(e) => { e.preventDefault(); setAccordionOpen(!accordionOpen); }}>
          <p className="pb-1 px-1">
            {children}
          </p>
        </div>
      </div>}
    </div>
  )
}