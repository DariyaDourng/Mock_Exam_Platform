import * as React from "react"

import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("relative w-full", className)} ref={ref} {...props} />
  },
)
ChartContainer.displayName = "ChartContainer"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div className={cn("h-full w-full", className)} ref={ref} {...props} />
})
Chart.displayName = "Chart"

interface ChartTooltipProps {
  label: string
  value: string
  color: string
}

const ChartTooltip = ({ label, value, color }: ChartTooltipProps) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn("rounded-md border bg-popover p-4 text-popover-foreground shadow-sm", className)}
        ref={ref}
        {...props}
      />
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("flex items-center space-x-4", className)} ref={ref} {...props} />
  },
)
ChartLegend.displayName = "ChartLegend"

interface ChartLegendItemProps {
  label: string
  color: string
}

const ChartLegendItem = ({ label, color }: ChartLegendItemProps) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  )
}

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendItem }
