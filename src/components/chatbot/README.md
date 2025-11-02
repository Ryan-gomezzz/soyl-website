# SOYL Chatbot (MCQ)

A production-ready, MCQ-driven chatbot component for the SOYL marketing website. The chatbot guides users through multiple-choice questions to help them learn about products, request pilots, explore careers, and more.

## Features

- **MCQ-driven flow**: Branching conversation based on multiple-choice questions
- **Non-blocking panel**: Slide-in right panel that doesn't block page interactions by default
- **Pin & minimize**: Pin panel to keep it open across navigation, minimize to launcher bubble
- **Modal Assist Mode**: Optional focus trap mode for critical flows (can be enabled via settings)
- **Session persistence**: Panel state (open/pinned/minimized) saved in sessionStorage
- **Privacy-first**: PII redaction, consent checkbox, no data collection without permission
- **Accessible**: Keyboard navigation, optional focus trap, screen reader support, ARIA labels
- **Responsive**: Full-screen overlay on mobile (<640px), slide-in panel on desktop
- **Analytics hooks**: Integrates with `window.__SOYL_TRACK` if available
- **Server-side logging**: Non-PII session logs stored server-side

## New Behavior (Non-Blocking Panel)

The chatbot now uses a **non-blocking slide-in panel** instead of a blocking modal:

- **Default behavior**: Panel opens as a right-side drawer. Background page remains clickable and interactive.
- **No focus trap by default**: Tab navigation moves between panel and page naturally.
- **Visual overlay**: Translucent glass overlay provides visual separation but doesn't block pointer events.
- **Pin feature**: Pin the panel to keep it open across page navigation. When pinned, panel won't close on ESC.
- **Minimize feature**: Collapse panel to the launcher bubble while keeping state.
- **Modal Assist Mode**: Enable via checkbox in panel footer to restore classic modal behavior (focus trap + blocking overlay).

### Panel Dimensions

- **Desktop**: 420px wide, fixed right position (`right: 1rem`), top at `1.75rem` (`top: 1.75rem`)
- **Mobile (<640px)**: Full-width overlay for better usability

## Flow JSON Structure

The chatbot flow is defined in `mcq-flows/default-flow.json`. To edit the conversation flow:

### Node Types

1. **`question`**: Displays text and provides multiple choice options
   ```json
   {
     "type": "question",
     "text": "Your question here?",
     "choices": [
       { "id": "c_1", "text": "Option 1", "next": "n_next_node" }
     ]
   }
   ```

2. **`info`**: Informational message with optional choices
   ```json
   {
     "type": "info",
     "text": "Information text here",
     "choices": [
       { "id": "c_back", "text": "Back", "next": "n_previous" }
     ]
   }
   ```

3. **`end`**: Terminal node with action buttons
   ```json
   {
     "type": "end",
     "text": "Final message",
     "actions": [
       { "type": "mailto", "value": "email@soyl.ai", "subject": "Subject" },
       { "type": "cta", "label": "Button Text", "href": "/path" }
     ]
   }
   ```

### Action Types

- **`mailto`**: Opens email client with pre-filled recipient/subject
- **`cta`**: Button linking to internal or external URL
- **`link`**: Simple link navigation
- **`feedback`**: Shows feedback form (email, company, message)

### Example: Adding a New Node

1. Add node definition to `nodes` object:
   ```json
   "n_new_node": {
     "type": "info",
     "text": "This is a new informational node",
     "choices": [
       { "id": "c_back", "text": "Go back", "next": "n_welcome" }
     ]
   }
   ```

2. Link to it from another node:
   ```json
   "choices": [
     { "id": "c_new_option", "text": "See new info", "next": "n_new_node" }
   ]
   ```

## Privacy & Security

### PII Redaction

The chatbot detects personal information (emails, phone numbers) in feedback messages and:
1. Shows a warning to the user
2. Displays redacted preview
3. Automatically redacts before sending to server

### Consent

Users must consent to analytics before starting the flow. Consent is:
- Required before first interaction
- Stored in sessionStorage
- Logged with each interaction

### Server Logging

Logs are sent to `/api/chatbot/log` with:
- `sessionId`: Anonymous session identifier
- `nodeId`: Current conversation node
- `choiceId`: Selected choice (if applicable)
- `timestamp`: Interaction time
- `consent`: User consent status
- `redacted`: Whether PII was redacted

**Note**: No PII (personally identifiable information) is sent to the server. Only choice IDs and node IDs are logged.

## Accessibility

- **Keyboard navigation**: All choices are keyboard-accessible
- **No focus trap by default**: Tab/Shift+Tab moves between panel and page naturally
- **Optional focus trap**: Enable "Modal Assist Mode" in panel footer to enable focus trap
- **ESC key**: Closes panel when not pinned
- **ARIA labels**: Proper dialog (`role="dialog"` in modal mode) or complementary (`role="complementary"` by default) labels
- **Screen reader support**: Semantic HTML and ARIA attributes
- **Reduced motion**: Respects `prefers-reduced-motion` media query
- **Panel roles**: Uses `role="complementary"` by default, switches to `role="dialog"` with `aria-modal="true"` when modal mode is enabled

## Analytics Integration

The chatbot calls `window.__SOYL_TRACK('chatbot:flow_start', data)` when flow starts (if available).

To enable analytics, ensure `window.__SOYL_TRACK` is defined:

```javascript
window.__SOYL_TRACK = function(event, data) {
  // Your analytics code here
  console.log(event, data)
}
```

## Modal Mode API

For flows that require strict modal behavior (e.g., collecting sensitive information), you can temporarily enable modal mode:

### Using `requestModalModeForFlow`

The `MCQEngine` component accepts an optional `requestModalModeForFlow` prop. You can also access it via the global `window.__SOYL_CHAT_REQUEST_MODAL` function:

```typescript
// In a flow node or custom component
if (typeof window !== 'undefined' && window.__SOYL_CHAT_REQUEST_MODAL) {
  // Enable modal mode for this step
  window.__SOYL_CHAT_REQUEST_MODAL(true)
  
  // ... do your critical step ...
  
  // Disable when done (optional, panel will reset on navigation)
  window.__SOYL_CHAT_REQUEST_MODAL(false)
}
```

### Automatic Modal Mode

Feedback nodes (`type: 'feedback'` or node ID `n_pilot_contact`) automatically enable modal mode temporarily to ensure form completion.

**Important**: Only use modal mode for steps that genuinely require it. Don't enable it globally - let users choose via the panel settings.

## Testing

Run tests with:

```bash
npm test -- MCQEngine.test.tsx
npm test -- ChatbotPanel.test.tsx
```

Tests cover:
- Node navigation
- Consent requirement
- Logging calls
- Back/restart functionality
- Panel overlay pointer-events behavior
- ESC key handling (with/without pin)
- Modal mode toggle
- Background click behavior

## Customization

### Styling

Styles are in `ChatbotStyles.css`. The component uses Tailwind CSS primarily, with custom CSS for:
- Absolute positioning (launcher button)
- Focus trap container
- PII warning styles

### Extending Flows

Create additional flow JSON files in `mcq-flows/` and load them dynamically:

```typescript
import customFlow from './mcq-flows/custom-flow.json'

<ChatbotPanel flow={customFlow as FlowJson} />
```

### Customizing Panel Width & Breakpoint

To change panel width or mobile breakpoint, modify `ChatbotPanel.tsx`:

```typescript
// Panel width
className="... w-[420px] ..." // Change 420px to desired width

// Mobile breakpoint (full-width overlay)
className="... max-sm:w-full ..." // Change max-sm to desired breakpoint (sm/md/lg)
```

## File Structure

```
src/components/chatbot/
├── index.tsx                    # Main chatbot component
├── ChatbotLauncher.tsx          # Floating button (with drag support)
├── ChatbotPanel.tsx             # Non-blocking slide-in panel
├── ChatbotModal.tsx             # [Legacy] Old modal (kept for reference)
├── MCQEngine.tsx                # Flow engine & state
├── ChatbotStyles.css            # Custom styles
├── hooks/
│   ├── useSessionId.ts          # Session ID generation
│   └── useChatbotState.ts       # Panel state management (pin/minimize/persist)
├── mcq-flows/
│   └── default-flow.json        # Default conversation flow
├── __tests__/
│   ├── MCQEngine.test.tsx       # Unit tests
│   └── ChatbotPanel.test.tsx    # Panel behavior tests
└── README.md                    # This file
```

## Server Endpoint

The logging endpoint is at `src/app/api/chatbot/log/route.ts` (App Router).

Logs are written to `var/chatbot-logs.json` (newline-delimited JSON) or console.log if filesystem is not available (e.g., serverless environments).

## Security Notes

⚠️ **Important**: 
- Do NOT collect PII via bot flows
- Always require explicit opt-in
- Always redact PII after confirmation
- Server logs do not contain user-identifiable information
- Contact `privacy@soyl.ai` for deletion requests (as noted in UI)

## Integration with AssistantPromo

The `AssistantPromo` component on the landing page integrates with the chatbot using `ChatbotController`:

### ChatbotController API

Located in `src/components/chatbot/controller.ts`, this controller provides a programmatic API to control the chatbot panel:

```typescript
import { ChatbotController } from '@/components/chatbot/controller'

// Open the panel
ChatbotController.open()

// Close the panel
ChatbotController.close()

// Toggle panel (open if closed, close if open)
ChatbotController.toggle()
```

### AssistantPromo Integration

The `AssistantPromo` component (located at `src/components/AssistantPromo.tsx`) provides a hero-adjacent promo card with two CTAs:

1. **"Try the Assistant"** (Primary CTA):
   - Calls `ChatbotController.open()` to open the chatbot panel
   - Moves focus to the panel (no focus trap by default)
   - Dispatches `soyl-chatbot-open` custom event

2. **"How it works"** (Secondary CTA):
   - Smooth-scrolls to `#how-it-works` section on the same page
   - Falls back to `/docs#how-it-works` if section not found
   - Respects `prefers-reduced-motion` for scroll behavior

### Event-Based Integration

The chatbot listens for custom events dispatched by `ChatbotController`:

- `soyl-chatbot-open`: Opens the panel
- `soyl-chatbot-close`: Closes the panel
- `soyl-chatbot-toggle`: Toggles panel state

These events are handled by `ChatbotPanel.tsx` and `ChatbotLauncher.tsx`.

### Implementation Details

```typescript
// In AssistantPromo.tsx
import { ChatbotController } from './chatbot/controller'

const handleTryAssistant = () => {
  ChatbotController.open()
}

// In ChatbotPanel.tsx
useEffect(() => {
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleToggle = () => setOpen((prev) => !prev)

  window.addEventListener('soyl-chatbot-open', handleOpen)
  window.addEventListener('soyl-chatbot-close', handleClose)
  window.addEventListener('soyl-chatbot-toggle', handleToggle)

  return () => {
    window.removeEventListener('soyl-chatbot-open', handleOpen)
    window.removeEventListener('soyl-chatbot-close', handleClose)
    window.removeEventListener('soyl-chatbot-toggle', handleToggle)
  }
}, [])
```

### Privacy Note

The AssistantPromo component does not collect any data. It simply opens the chatbot panel, which has its own consent flow. See the Privacy & Security section above for chatbot privacy details.

## Support

For questions or issues:
- Email: `support@soyl.ai`
- See main README for contribution guidelines

