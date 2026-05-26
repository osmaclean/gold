"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      theme="dark"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "glass !border-border !text-foreground",
          title: "font-medium",
          description: "text-muted-foreground",
        },
      }}
    />
  )
}
