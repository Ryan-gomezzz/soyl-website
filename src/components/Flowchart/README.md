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
├── FlowchartSection.tsx   # Main wrapper component (centered layout)
├── FlowchartCanvas.tsx     # SVG canvas renderer with ambient layer
├── FlowNode.tsx           # Individual node card (hover/focus/tap behavior)
├── FlowNodePopup.tsx      # Popup component (tooltip on hover/focus/tap)
├── FlowEdge.tsx           # Edge/connection renderer
├── AmbientLayer.tsx       # Continuous background animation layer
├── flow-data.ts           # Node and edge data (EDIT HERE)
├── __tests__/
│   ├── Flowchart.test.tsx        # Basic rendering tests
│   └── FlowchartHover.test.tsx   # Hover/focus/tap behavior tests
└── README.md             # This file
```

## Canvas Alignment & Layout

The Flowchart canvas is centered horizontally within a max-width container (`max-width: 1200px`) with automatic centering. The layout is responsive and maintains consistent alignment across all breakpoints.

### Centering Configuration

Centering is handled by:
- `FlowchartSection.tsx` - Wrapper with `max-w-[1200px]` and `mx-auto` for horizontal centering
- `FlowchartCanvas.tsx` - Canvas positioned relative to container
- CSS in `src/styles/flowchart.css` - Additional centering utilities

## Ambient Animation

The flowchart includes a continuous ambient animation layer (`AmbientLayer`) that runs full-time behind the nodes, providing subtle visual motion.

### Enabling/Disabling Ambient Animation

Ambient animation is automatically disabled when:
- User has `prefers-reduced-motion` enabled
- Component `useReducedMotion()` hook returns true

To manually disable ambient animation, pass `enabled={false}` to `AmbientLayer`:

```tsx
<AmbientLayer enabled={false} width={size.w} height={size.h} />
```

### Configuring Animation Speed & Opacity

Edit `src/components/Flowchart/AmbientLayer.tsx`:

```typescript
// Particle velocity (lower = slower)
vx: (Math.random() - 0.5) * 0.1,  // Horizontal speed
vy: (Math.random() - 0.5) * 0.1,  // Vertical speed

// Particle opacity (range: 0.06 to 0.12)
alpha: 0.06 + Math.random() * 0.06,

// Particle count
const particleCount = 30;  // Increase for more particles
```

### Animation Behavior

- **Duration**: Continuous (infinite loop via `requestAnimationFrame`)
- **Performance**: GPU-accelerated via canvas rendering
- **Interaction**: `pointer-events: none` so it doesn't interfere with node interactions
- **Z-index**: Positioned behind nodes (z-10) but above background patterns

## Node Popups

Node detail popups appear on hover (desktop), focus (keyboard), or tap (mobile/touch devices).

### Popup Behavior

- **Desktop**: Popup appears on `mouseenter` and disappears on `mouseleave`
- **Keyboard**: Popup appears on `focus` and disappears on `blur`
- **Touch Devices**: Popup toggles on `click/tap`; tap outside to close
- **Escape Key**: Closes popup when open

### Popup Configuration

#### Flip Logic (Auto-positioning)

The popup automatically flips to avoid viewport cut-off:
- If node is on right side (x > 80% of viewport), popup shows to the left
- If node is on left side (x < 20% of viewport), popup shows to the right
- If popup would overflow bottom, shows above node
- Horizontal position adjusts to stay within viewport bounds (20px padding)

Edit flip thresholds in `src/components/Flowchart/FlowNodePopup.tsx`:

```typescript
// Right side threshold
if (anchor.left > viewport.width * 0.8) { /* show left */ }

// Left side threshold
if (anchor.left < viewport.width * 0.2) { /* show right */ }
```

#### Popup Offset

Default offset from node: **8px**

Edit in `FlowNodePopup.tsx`:
```typescript
let top = anchor.bottom + 8;  // Adjust offset here
```

#### Popup Content

Popup displays:
- Node title (required)
- Subtitle (if provided)
- Description (truncated to 2 lines with `line-clamp-2`)
- CTA link (if `node.cta` is set)

### Accessibility

- Popup uses `role="tooltip"` for screen readers
- Keyboard accessible: Tab to focus node, popup appears automatically
- Escape key closes popup
- Clicking outside closes popup
- ARIA attributes: `aria-haspopup="true"`, `aria-expanded={popupOpen}`

## Reduced Motion Support

All animations respect the user's `prefers-reduced-motion` preference:

### Ambient Layer
- Automatically disabled when `prefers-reduced-motion: reduce` is set
- No particle animation created

### Node Animations
- Entrance animations: Instant (no scale/opacity transitions)
- Hover effects: No transforms (scale/y shifts disabled)
- Popup transitions: Instant (no fade-in/scale animations)

### Implementation

The component checks for reduced motion in multiple ways:
1. `useReducedMotion()` hook from framer-motion
2. `window.matchMedia('(prefers-reduced-motion: reduce)')` for ambient layer
3. CSS `@media (prefers-reduced-motion: reduce)` in `flowchart.css`

## Testing

Run tests with:
```bash
npm test -- Flowchart.test.tsx          # Basic rendering
npm test -- FlowchartHover.test.tsx     # Hover/focus/tap behavior
```

Tests verify:
- All nodes from flow-data.ts are rendered
- Node hover interactions show popup
- Keyboard focus shows popup
- Touch device tap toggles popup
- Ambient layer renders with correct attributes
- Reduced motion disables animations
- Popup closes on outside click

## Accessibility

- Nodes are keyboard accessible (Tab to focus, Enter/Space to activate)
- Focus outlines are visible and meet WCAG AA contrast
- ARIA labels are properly set (`aria-haspopup`, `aria-expanded`, `role="tooltip"`)
- Respects `prefers-reduced-motion` for all animations
- Popup text contrast meets WCAG AA standards
- Escape key closes popups
- Popups are dismissible by clicking outside

## Citation

When updating node content, please maintain reference to the SOYL R&D document as the source:
> Node descriptions adapted from: SOYL R&D (2).pdf - R&D phases and milestones documentation

