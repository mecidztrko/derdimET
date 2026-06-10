import { createContext, useContext, useState, HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface TabsContextType {
  activeTab: string
  setActiveTab: (value: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
  ...props
}: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? value ?? '')
  const activeTab = value !== undefined ? value : internal
  const setActiveTab = (v: string) => {
    if (value === undefined) setInternal(v)
    onValueChange?.(v)
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'inline-flex h-12 items-center justify-start gap-1 rounded-xl border border-border/70 bg-card/80 p-1 shadow-sm backdrop-blur-sm',
        className,
      )}
      {...props}
    />
  )
}

interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string
}

export function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsTrigger must be used within Tabs')

  const { activeTab, setActiveTab } = context
  const isActive = activeTab === value

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-small font-medium transition-all',
        'hover:bg-muted/80 hover:text-foreground',
        isActive &&
          'bg-gradient-to-b from-primary to-[rgb(29,78,216)] text-primary-foreground shadow-md shadow-primary/20',
        !isActive && 'text-muted-foreground',
        className,
      )}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  )
}

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string
}

export function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsContent must be used within Tabs')

  const { activeTab } = context

  if (activeTab !== value) return null

  return (
    <div className={cn('mt-4', className)} {...props}>
      {children}
    </div>
  )
}
