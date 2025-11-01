'use client'

import * as React from 'react'
import { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse'
import { toast } from 'sonner'

export default function AddTransactionDialog() {
  const [open, setOpen] = useState(false)
  const [csvData, setCsvData] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)

  // --- 1️⃣ Parse CSV into JSON ---
  const handleFile = useCallback((file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data)
        toast.success(`Parsed ${results.data.length} rows successfully`)
      },
      error: (error) => {
        console.error('CSV parse error:', error)
        toast.error('Failed to parse CSV file')
      },
    })
  }, [])

  // --- 2️⃣ Dropzone configuration ---
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) handleFile(acceptedFiles[0])
    },
  })

  // --- 3️⃣ Upload to API ---
  const handleSubmit = async () => {
    if (csvData.length === 0) {
      toast.error('Please upload a CSV file first')
      return
    }

    setIsUploading(true)
    try {
      const res = await fetch('/api/transactions/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: csvData }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const json = await res.json()
      toast.success(`Uploaded ${csvData.length} transactions`)
      console.log('✅ Upload success:', json)
      setOpen(false)
      setCsvData([])
    } catch (err) {
      console.error('Upload error:', err)
      toast.error('Failed to upload transactions')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl"
        onClick={() => setOpen(true)}
      >
        Add Transactions
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Transactions</DialogTitle>
            <DialogDescription>
              Upload a CSV file — the first row should contain column headers.
            </DialogDescription>
          </DialogHeader>

          {/* ===== Drag & Drop Zone ===== */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition 
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-300 hover:border-zinc-400'}
            `}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-blue-700 font-medium">Drop your CSV file here...</p>
            ) : (
              <p className="text-zinc-600">
                Drag & drop your CSV file here, or click to select
              </p>
            )}
          </div>

          {/* ===== Preview ===== */}
          {csvData.length > 0 && (
            <div className="mt-4 border rounded bg-zinc-50 p-3 max-h-40 overflow-auto text-xs font-mono">
              <pre>{JSON.stringify(csvData.slice(0, 3), null, 2)}</pre>
              {csvData.length > 3 && <div className="text-zinc-500 mt-1">...and {csvData.length - 3} more rows</div>}
            </div>
          )}

          {/* ===== Actions ===== */}
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSubmit}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Submit'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
