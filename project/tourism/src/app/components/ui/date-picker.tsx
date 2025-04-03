import type { DateRange } from "react-day-picker"

interface DatePickerProps {
  selected: DateRange | undefined
  onSelect: (date: DateRange | undefined) => void
}

export function DatePicker({ selected, onSelect }: DatePickerProps) {
  return (
    <div>
      <input
        type="text"
        placeholder="Select date range"
        value={selected?.from?.toLocaleDateString() + " - " + selected?.to?.toLocaleDateString()}
        readOnly
        onClick={() => onSelect(undefined)} // Example usage of onSelect
      />
    </div>
  )
}

