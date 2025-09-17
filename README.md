# 🚀 Kanban Board - Learning Progress Tracker

A modern, responsive kanban board built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui components**. Perfect for tracking learning progress with a beautiful floating UI design.

![Kanban Board](https://img.shields.io/badge/Next.js-15.5.3-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38b2ac?logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ Features

### 🎯 **Core Functionality**
- **Three-Column Workflow**: New → Learning → Completed
- **Full Task Management**: Create, edit, delete, and move tasks
- **Smart Progress Tracking**: Time spent, completion dates, and progress bars
- **Advanced Search**: Search across titles, descriptions, and tags
- **Priority System**: High, medium, and low priority tasks with visual indicators

### 🎨 **Beautiful Design**
- **Floating UI Elements**: Both header and navigation bars float above content
- **Custom OKLCH Color Theme**: Modern color system with Space Mono typography
- **Smooth Animations**: Drag & drop with spring-like physics and hover effects
- **Custom Scrollbars**: Theme-aware scrollbars that blend seamlessly

### 🖱️ **Interactive Experience**
- **Drag & Drop**: Intuitive task movement between columns with visual feedback
- **Modal Forms**: Clean task creation and editing with validation
- **Smart Dropdowns**: Quick actions and status changes
- **Live Updates**: Real-time progress calculation and statistics

### 📱 **Mobile-First Design**
- **Responsive Layout**: Adaptive grid that stacks on mobile
- **Touch Optimized**: Perfect touch targets and gesture support
- **Mobile Navigation**: Full-width floating bar optimized for thumbs
- **Adaptive Typography**: Scales beautifully across all screen sizes

## 🏗️ **Tech Stack**

- **Framework**: Next.js 15 with Turbopack
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0 with custom OKLCH theme
- **UI Components**: shadcn/ui with Radix UI primitives
- **Drag & Drop**: @dnd-kit/core with smooth animations
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Font**: Space Mono (monospace)

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ or Bun 1.0+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kanban-board.git
   cd kanban-board
   ```

2. **Install dependencies**
   ```bash
   # Using bun (recommended)
   bun install
   
   # Or using npm
   npm install
   ```

3. **Start the development server**
   ```bash
   # Using bun
   bun dev
   
   # Or using npm
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 **Project Structure**

```
src/
├── app/                     # Next.js 15 app directory
│   ├── globals.css         # Global styles with custom theme
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── ui/                 # shadcn/ui components
│   │   ├── card.tsx
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   └── kanban/             # Kanban-specific components
│       ├── kanban-board.tsx      # Main board component
│       ├── simple-header.tsx     # Floating header
│       ├── floating-navbar.tsx   # Bottom navigation
│       ├── draggable-task-card.tsx
│       ├── droppable-column.tsx
│       └── task-form.tsx
├── lib/
│   ├── utils.ts            # Utility functions
│   └── mock-data.ts        # Sample data
└── types/
    └── kanban.ts           # TypeScript definitions
```

## 🎨 **Design System**

### Color Palette
The app uses a custom OKLCH color theme for better perceptual uniformity:

- **Primary**: `oklch(0.6180 0.0778 65.5444)` - New tasks
- **Secondary**: `oklch(0.7264 0.0581 66.6967)` - Learning tasks  
- **Success**: `oklch(0.4851 0.0570 72.6827)` - Completed tasks

### Typography
- **Font Family**: Space Mono (monospace)
- **Weights**: 400, 700
- **Scale**: Responsive scaling with mobile optimizations

## 🎯 **Key Components**

### KanbanBoard
The main orchestrator component that manages:
- Task state and filtering
- Drag & drop logic with collision detection
- Modal state management
- Real-time statistics calculation

### DraggableTaskCard
Individual task cards with:
- Smooth drag animations
- Priority indicators
- Progress tracking for learning tasks
- Quick action dropdowns

### FloatingNavbar
Bottom navigation with:
- Primary add task CTA
- Search functionality
- Settings and profile menus
- Mobile-optimized layout

## 🔧 **Customization**

### Adding New Task Statuses
1. Update the `TaskStatus` type in `src/types/kanban.ts`
2. Add configuration in `COLUMN_CONFIG`
3. Update the grid layout in `kanban-board.tsx`

### Theming
Modify the CSS custom properties in `src/app/globals.css`:
```css
:root {
  --primary: oklch(0.6180 0.0778 65.5444);
  --secondary: oklch(0.8846 0.0302 85.5655);
  /* ... more variables */
}
```

### Form Fields
Extend the task schema in `src/components/kanban/task-form.tsx`:
```typescript
const taskSchema = z.object({
  title: z.string().min(1),
  // Add your custom fields here
})
```

## 📱 **Mobile Experience**

The app is designed mobile-first with:
- **Thumb-friendly navigation** at the bottom
- **Swipe-optimized** drag and drop
- **Responsive typography** that scales perfectly
- **Touch targets** sized for accessibility (44px minimum)

## 🚀 **Deployment**

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy the .next folder
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component system
- [dnd-kit](https://dndkit.com/) for smooth drag and drop
- [Lucide](https://lucide.dev/) for the icon set
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first styling

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies.**