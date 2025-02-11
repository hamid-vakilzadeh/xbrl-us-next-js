"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useDashboardStore } from "@/store/dashboard"

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onSelect: (value: string) => void
  placeholder?: string
  emptyText?: string
  className?: string
}

export function Combobox({
  options,
  value,
  onSelect,
  placeholder = "Select an option...",
  emptyText = "No options found.",
  className
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [currentValue, setCurrentValue] = React.useState(value || "")
  const { sidebarWidth } = useDashboardStore()
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    setCurrentValue(value || "")
  }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full min-h-[40px] justify-between",
            "bg-background text-foreground",
            "hover:bg-accent hover:text-accent-foreground",
            "border border-input shadow-sm",
            "transition-colors duration-150",
            className
          )}
        >
          <span className="flex-1 truncate text-left">
            {currentValue
              ? options.find((option) => option.value === currentValue)?.label
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "p-0 shadow-md",
          "bg-popover border border-input",
        )}
        style={{ 
          width: triggerRef.current?.offsetWidth || sidebarWidth - 32 // 32px accounts for sidebar padding
        }}
        align="start"
        sideOffset={4}
      >
        <Command className="w-full">
          <CommandInput 
            placeholder={placeholder}
            className="bg-transparent"
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onSelect(currentValue)
                    setCurrentValue(currentValue)
                    setOpen(false)
                  }}
                  className={cn(
                    "cursor-pointer",
                    "hover:bg-accent hover:text-accent-foreground",
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    "data-[selected]:bg-accent data-[selected]:text-accent-foreground"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentValue === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="flex-1 truncate">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
