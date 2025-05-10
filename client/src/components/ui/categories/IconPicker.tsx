import { useState } from "react";
import { Button } from "~/components/lib/button";
import { Input } from "~/components/lib/input";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/lib/popover";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { LucideProps } from "lucide-react";
import { Suspense, lazy } from "react";

interface IconProps extends Omit<LucideProps, "ref"> {
  name: keyof typeof dynamicIconImports;
}

const Icon = ({ name, ...props }: IconProps) => {
  const LazyIcon = lazy(dynamicIconImports[name]);
  return (
    <Suspense fallback={<span className="inline-block w-4 h-4" />}>
      <LazyIcon {...props} />
    </Suspense>
  );
};

interface IconPickerProps {
  value?: string;
  onChange: (iconName: string) => void;
}

const defaultCategoryIcons = [
  "shopping-cart", "utensils-crossed", "car", "bus", "home",
  "wifi", "plug", "dumbbell", "heart", "book",
  "plane", "credit-card", "banknote", "gift", "shirt",
  "sparkles", "music", "file-text", "scissors", "circle"
] as const;

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const allIcons = Object.keys(dynamicIconImports);
  const filteredIcons = allIcons.filter((name) =>
    name.toLowerCase().includes(filter.toLowerCase())
  );
  const shownIcons = filter.trim() === ""
    ? defaultCategoryIcons
    : filteredIcons.slice(0, 50);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {value ? <Icon name={value as keyof typeof dynamicIconImports} size={16} /> : "Pick icon"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 max-h-[300px] overflow-auto">
        <Input
          placeholder="Search icons..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-2"
        />
        <div className="grid grid-cols-5 gap-2">
          {shownIcons.map((name) => (
            <button
              key={name}
              onClick={() => {
                onChange(name);
                setOpen(false);
              }}
              className="p-2 hover:bg-muted rounded flex flex-col items-center text-xs"
            >
              <Icon name={name as keyof typeof dynamicIconImports} size={20} />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};