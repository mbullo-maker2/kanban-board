# KANBAN APP - SHADCN/UI COMPONENT MAPPING

## 🏠 Header/Navigation Bar
```
├── App Title/Logo
│   └── shadcn: Custom text/heading (no specific component needed)
│
├── User Profile/Avatar  
│   └── shadcn: Avatar + AvatarImage + AvatarFallback
│
└── Settings/Menu Button
    └── shadcn: Button (variant="ghost") + DropdownMenu + DropdownMenuContent + DropdownMenuItem
```

## 🎯 Main Dashboard

### 📊 Board Container
```
└── shadcn: Custom flex container (no specific component needed)
```

### 🆕 NEW Column
```
├── Column Header
│   ├── Title: "New"
│   │   └── shadcn: Custom heading/text
│   │
│   ├── Task Count Badge
│   │   └── shadcn: Badge (variant="secondary")
│   │
│   └── Add Task Button (+)
│       └── shadcn: Button (variant="outline" + size="sm") + Plus icon
│
└── Task Cards Container
    └── Task Card
        ├── Card Container
        │   └── shadcn: Card + CardHeader + CardContent + CardFooter
        │
        ├── Task Title
        │   └── shadcn: CardTitle
        │
        ├── Task Description  
        │   └── shadcn: CardDescription
        │
        ├── Priority Indicator
        │   └── shadcn: Badge (variant="destructive"|"default"|"secondary")
        │
        ├── Due Date
        │   └── shadcn: Text with Calendar icon
        │
        └── Action Menu (...)
            └── shadcn: DropdownMenu + DropdownMenuTrigger + DropdownMenuContent + DropdownMenuItem
```

### 📚 LEARNING Column
```
├── Column Header
│   ├── Title: "Learning"
│   │   └── shadcn: Custom heading/text
│   │
│   ├── Task Count Badge
│   │   └── shadcn: Badge (variant="secondary")
│   │
│   └── Progress Indicator
│       └── shadcn: Progress
│
└── Task Cards Container
    └── Task Card
        ├── Card Container
        │   └── shadcn: Card + CardHeader + CardContent + CardFooter
        │
        ├── Task Title
        │   └── shadcn: CardTitle
        │
        ├── Progress Bar
        │   └── shadcn: Progress
        │
        ├── Time Spent
        │   └── shadcn: Text with Clock icon
        │
        ├── Notes/Comments
        │   └── shadcn: Text or Textarea (if editable)
        │
        └── Action Menu (...)
            └── shadcn: DropdownMenu + DropdownMenuTrigger + DropdownMenuContent + DropdownMenuItem
```

### ✅ COMPLETED Column
```
├── Column Header
│   ├── Title: "Completed"
│   │   └── shadcn: Custom heading/text
│   │
│   ├── Task Count Badge
│   │   └── shadcn: Badge (variant="secondary")
│   │
│   └── Archive Button
│       └── shadcn: Button (variant="outline" + size="sm") + Archive icon
│
└── Task Cards Container
    └── Task Card
        ├── Card Container
        │   └── shadcn: Card + CardHeader + CardContent + CardFooter
        │
        ├── Task Title (strikethrough)
        │   └── shadcn: CardTitle with CSS line-through
        │
        ├── Completion Date
        │   └── shadcn: Text with CheckCircle icon
        │
        ├── Total Time Spent
        │   └── shadcn: Text with Clock icon
        │
        └── Action Menu (...)
            └── shadcn: DropdownMenu + DropdownMenuTrigger + DropdownMenuContent + DropdownMenuItem
```

## 🛠️ Controls & Actions

### Filter Options
```
├── Priority Filter
│   └── shadcn: Select + SelectTrigger + SelectContent + SelectItem
│
├── Date Range Filter  
│   └── shadcn: Popover + PopoverTrigger + PopoverContent + Calendar + Button
│
└── Search Bar
    └── shadcn: Input (with Search icon)
```

### Bulk Actions
```
├── Select All
│   └── shadcn: Checkbox + Label
│
├── Delete Selected
│   └── shadcn: Button (variant="destructive") + Trash icon
│
└── Export Data
    └── shadcn: Button (variant="outline") + Download icon
```

## 📝 Task Creation Modal/Form
```
├── Modal Container
│   └── shadcn: Dialog + DialogTrigger + DialogContent + DialogHeader + DialogTitle + DialogDescription + DialogFooter
│
├── Task Title Input
│   └── shadcn: Label + Input
│
├── Task Description Textarea
│   └── shadcn: Label + Textarea
│
├── Priority Selection (Low/Medium/High)
│   └── shadcn: Label + Select + SelectTrigger + SelectContent + SelectItem
│
├── Due Date Picker
│   └── shadcn: Label + Popover + PopoverTrigger + PopoverContent + Calendar + Button
│
├── Category/Tags Input
│   └── shadcn: Label + Input (with custom tag logic)
│
├── Cancel Button
│   └── shadcn: Button (variant="outline")
│
└── Save Button
    └── shadcn: Button (variant="default")
```

## ✏️ Task Edit Modal/Form
```
├── Modal Container
│   └── shadcn: Dialog + DialogTrigger + DialogContent + DialogHeader + DialogTitle + DialogDescription + DialogFooter
│
├── All Creation Fields (pre-populated)
│   └── shadcn: Same as Task Creation Modal components
│
├── Status Change Dropdown
│   └── shadcn: Label + Select + SelectTrigger + SelectContent + SelectItem
│
├── Time Tracking
│   └── shadcn: Label + Input (type="time" or custom time picker)
│
├── Comments/Notes Section
│   └── shadcn: Label + Textarea
│
├── Delete Button
│   └── shadcn: Button (variant="destructive") + Trash icon
│
├── Cancel Button
│   └── shadcn: Button (variant="outline")
│
└── Update Button
    └── shadcn: Button (variant="default")
```

## 📱 Mobile Responsive Layout

### Collapsible Sidebar
```
└── shadcn: Sheet + SheetTrigger + SheetContent + SheetHeader + SheetTitle + SheetDescription
```

### Floating Action Button (Add Task)
```
└── shadcn: Button (variant="default" + size="lg" + className for fixed positioning) + Plus icon
```

## 🔔 Notifications & Toast Messages
```
├── Task due date reminders
│   └── shadcn: Toast + ToastAction + ToastClose + ToastDescription + ToastTitle
│
├── Long-running tasks in LEARNING
│   └── shadcn: Toast (variant="default")
│
└── Weekly progress summary
    └── shadcn: Toast + ToastAction
```

## 🎨 Visual Indicators & Icons

### Priority Indicators
```
├── High Priority
│   └── shadcn: Badge (variant="destructive") + AlertCircle icon
│
├── Medium Priority
│   └── shadcn: Badge (variant="default") + Clock icon
│
└── Low Priority
    └── shadcn: Badge (variant="secondary") + Minus icon
```

### Status Icons
```
├── NEW Column
│   └── Plus, Circle, or FileText icon
│
├── LEARNING Column
│   └── BookOpen, Play, or Activity icon
│
└── COMPLETED Column
    └── CheckCircle, Check, or Archive icon
```

## 🎨 Color Scheme Implementation
```
NEW Column Theme:
- Primary: Blue accent (#3B82F6) - use CSS custom properties
- Badge variants: "default" with blue styling

LEARNING Column Theme:  
- Primary: Orange accent (#F59E0B) - use CSS custom properties
- Badge variants: "secondary" with orange styling

COMPLETED Column Theme:
- Primary: Green accent (#10B981) - use CSS custom properties  
- Badge variants: "outline" with green styling
```

## 📦 Additional Required Packages
```
For full functionality, you'll also need:
- @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities (for drag & drop)
- date-fns or moment.js (for date formatting)
- lucide-react (icons - usually comes with shadcn)
- react-hook-form + @hookform/resolvers/zod (form handling)
```

## 🔧 Custom Components to Build
```
Components not directly available in shadcn that need custom implementation:
- KanbanColumn (wrapper for column logic)  
- TaskCard (wrapper combining Card with drag/drop logic)
- ProgressTimer (time tracking component)
- TagInput (for category/tags with add/remove functionality)
- ColumnDragPreview (visual feedback during drag operations)
```