import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "~/components/lib/button";
import { Calendar } from "~/components/lib/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/lib/popover";

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal col-span-3"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 z-50"
        align="start"
        side="bottom"
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={e => onChange(e as Date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
