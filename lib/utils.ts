import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "@/hooks/use-toast"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Toast utility functions
export const showToast = {
  loading: (t: any, title = "loading", description = "please.wait") => {
    return toast({
      title: t(title),
      description: t(description),
      duration: 3000,
    })
  },
  success: (t: any, title = "success", description = "operation.success", duration = 3000) => {
    return toast({
      title: t(title),
      description: t(description),
      duration: duration,
    })
  },
  error: (t: any, title = "error", description = "operation.failed", errorMessage?: string, duration = 5000) => {
    return toast({
      title: t(title),
      description: errorMessage || t(description),
      variant: "destructive",
      duration: duration,
    })
  },
  info: (t: any, title: string, description: string, duration = 3000) => {
    return toast({
      title: t(title),
      description: t(description),
      duration: duration,
    })
  },
  custom: (props: any) => {
    return toast(props)
  }
}
