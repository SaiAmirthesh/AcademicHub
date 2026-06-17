import * as React from "react"
import { Tooltip, ResponsiveContainer } from "recharts"
import { cn } from "../../lib/utils"

// Format: { [key in string]: { label?: string; color?: string } }
export type ChartConfig = {
  [key in string]: {
    label?: string
    color?: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactElement
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, config, children, ...props }, ref) => {
    // Generate CSS variables for the chart colors
    const style = React.useMemo(() => {
      const cssVars: Record<string, string> = {}
      Object.entries(config).forEach(([key, val]) => {
        if (val.color) {
          cssVars[`--color-${key}`] = val.color
        }
      })
      return cssVars
    }, [config])

    return (
      <div
        ref={ref}
        style={style as React.CSSProperties}
        className={cn("w-full h-full", className)}
        {...props}
      >
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = Tooltip

interface ChartTooltipContentProps {
  active?: boolean
  payload?: any[]
  label?: string
  hideLabel?: boolean
  config?: ChartConfig
}

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps
>(({ active, payload, label, hideLabel }, ref) => {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  return (
    <div
      ref={ref}
      className="rounded-lg border bg-popover p-2 shadow-md text-xs font-bold border-border text-popover-foreground space-y-1.5"
    >
      {!hideLabel && label && <div className="font-semibold text-muted-foreground">{label}</div>}
      <div className="space-y-1">
        {payload.map((item: any, idx: number) => {
          const name = item.name
          const value = item.value
          const color = item.color || item.payload?.fill
          return (
            <div key={idx} className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-muted-foreground capitalize">{name}:</span>
              <span className="font-mono font-extrabold">{value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, ChartTooltip, ChartTooltipContent }
