import React, { useState, useCallback } from 'react'

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: 'default' | 'destructive'
}

interface ToastState {
  toasts: Toast[]
}

const initialState: ToastState = {
  toasts: [],
}

let state = initialState
let listeners: Array<(state: ToastState) => void> = []

function dispatch(action: { type: string; payload?: any }) {
  switch (action.type) {
    case 'ADD_TOAST':
      state = {
        ...state,
        toasts: [...state.toasts, action.payload],
      }
      break
    case 'UPDATE_TOAST':
      state = {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      }
      break
    case 'DISMISS_TOAST':
      state = {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      }
      break
    case 'REMOVE_TOAST':
      state = {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      }
      break
  }

  listeners.forEach((listener) => listener(state))
}

export function useToast() {
  const [toastState, setToastState] = useState<ToastState>(state)

  React.useEffect(() => {
    listeners.push(setToastState)
    return () => {
      const index = listeners.indexOf(setToastState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  const toast = useCallback(
    ({ ...props }: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9)
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          ...props,
          id,
        },
      })

      return {
        id,
        dismiss: () => dispatch({ type: 'DISMISS_TOAST', payload: id }),
        update: (props: Partial<Toast>) =>
          dispatch({ type: 'UPDATE_TOAST', payload: { ...props, id } }),
      }
    },
    []
  )

  return {
    ...toastState,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: 'DISMISS_TOAST', payload: toastId }),
  }
}