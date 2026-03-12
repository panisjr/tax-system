import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';

const Select = SelectPrimitive.Root;
const Trigger = SelectPrimitive.Trigger;
const Content = SelectPrimitive.Content;
const Viewport = SelectPrimitive.Viewport;
const Item = SelectPrimitive.Item;
const ItemText = SelectPrimitive.ItemText;
const Icon = SelectPrimitive.Icon;
const Value = SelectPrimitive.Value;

export { 
  Select,
  Trigger as SelectTrigger,
  Content as SelectContent,
  Viewport as SelectViewport,
  Item as SelectItem,
  ItemText as SelectItemText,
  Icon as SelectIcon,
  Value as SelectValue,
};

// simple wrapper should not be needed if using primitives directly
