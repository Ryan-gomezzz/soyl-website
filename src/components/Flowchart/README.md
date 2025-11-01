# Flowchart Component

Interactive flowchart visualization component that displays SOYL's R&D phases and product stack.

## Data Source

**Node descriptions adapted from:** SOYL R&D (2).pdf - R&D phases and milestones documentation

All node content (titles, subtitles, descriptions, timelines) were adapted from the SOYL R&D document. Please cite this source when updating node copy.

## Editing Flowchart Nodes

### File Location
`src/components/Flowchart/flow-data.ts`

### Node Structure

```typescript
{
  id: string,              // Unique identifier (e.g., "n_phase1")
  title: string,            // Main title displayed on node
  subtitle?: string,        // Optional subtitle
  description?: string,     // Full description shown in tooltip
  x: number,               // X position (0-1, normalized)
  y: number,               // Y position (0-1, normalized)
  size?: "sm" | "md" | "lg", // Node size
  cta?: {                  // Call-to-action
    label: string,
    href?: string,
    action?: "docs" | "pilot" | "contact"
  },
  meta?: {
    phase?: string         // Timeline (e.g., "0-6 mo")
  }
}
```

### How to Edit Node Positions

1. Open `src/components/Flowchart/flow-data.ts`
2. Find the node you want to move
3. Adjust the `x` and `y` values (range: 0.0 to 1.0)
   - `x: 0` = left edge, `x: 1` = right edge
   - `y: 0` = top edge, `y: 1` = bottom edge
4. Save the file
5. Run `npm run dev` and check the node position

### Example: Moving a Node

```typescript
// Before
{
  id: "n_phase1",
  title: "Phase 1 — MVP",
  x: 0.15,  // 15% from left
  y: 0.35,  // 35% from top
}

// After - moved to right-center
{
  id: "n_phase1",
  title: "Phase 1 — MVP",
  x: 0.7,   // 70% from left
  y: 0.5,   // 50% from top
}
```

### Adding New Nodes

1. Add node object to `flow.nodes` array
2. Add corresponding edges to `flow.edges` array (optional)
3. Ensure unique `id` values
4. Set normalized `x` and `y` positions

### Updating Node Copy

1. Edit `title`, `subtitle`, or `description` fields
2. For timeline info, update `meta.phase`
3. To add CTA, include `cta` object with `label` and `href`

### Edges (Connections)

Edges connect nodes visually. To add a connection:

```typescript
{
  from: "n_phase1",  // Source node ID
  to: "n_phase2",    // Target node ID
  label?: "validate → scale"  // Optional edge label
}
```

## Customizing Dot Colors

Dot colors used in hover effects are defined in `src/styles/tokens.css`:

```css
--dot-1: #1fb6ff;     /* cyan */
--dot-2: #7ce7c5;     /* mint */
--dot-3: #ffd166;     /* warm yellow */
--dot-4: #ff7ab6;     /* soft magenta */
```

To change dot colors, edit these CSS variables in `tokens.css`.

## Component Structure

```
src/components/Flowchart/
├── FlowchartSection.tsx   # Main wrapper component
├── FlowchartCanvas.tsx     # SVG canvas renderer
├── FlowNode.tsx           # Individual node card
├── FlowEdge.tsx           # Edge/connection renderer
├── flow-data.ts           # Node and edge data (EDIT HERE)
└── README.md             # This file
```

## Testing

Run tests with:
```bash
npm test -- Flowchart.test.tsx
```

Tests verify:
- All nodes from flow-data.ts are rendered
- Node hover interactions work
- Component accessibility

## Accessibility

- Nodes are keyboard accessible (Tab to focus, Enter to activate)
- Focus outlines are visible
- ARIA labels are properly set
- Respects `prefers-reduced-motion`

## Citation

When updating node content, please maintain reference to the SOYL R&D document as the source:
> Node descriptions adapted from: SOYL R&D (2).pdf - R&D phases and milestones documentation

