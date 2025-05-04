import { RadioGroupItem, RadioGroup } from "~/components/lib/radio-group";
import { Label } from "~/components/lib/label";
import type { ComponentProps } from "react";

interface TransactionTypeRadioProps extends ComponentProps<typeof RadioGroup> {
  value: "incoming" | "outgoing";
  onValueChange: (value: "incoming" | "outgoing") => void;
}

export default function TransactionTypeRadio({
  value,
  onValueChange,
  ...props
}: TransactionTypeRadioProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="rg">Choose Transaction Type</Label>
      <RadioGroup id="rg" value={value} onValueChange={onValueChange} {...props}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="incoming" id="r1" />
          <Label htmlFor="r1">Incoming</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="outgoing" id="r2" />
          <Label htmlFor="r2">Outgoing</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
