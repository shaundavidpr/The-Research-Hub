import type React from "react"

interface DashboardHeaderProps {
  heading: string
  text?: string
  icon?: React.ReactNode
  children?: React.ReactNode
  actions?: React.ReactNode
}

export function DashboardHeader({ heading, text, icon, children, actions }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2 mb-6">
      <div className="grid gap-1">
        <div className="flex items-center gap-2">
          {icon}
          <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
        </div>
        {text && <p className="text-muted-foreground">{text}</p>}
        {children}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
