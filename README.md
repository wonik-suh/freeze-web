# Freeze v1

Freeze v1 is a lightweight web-based tool that freezes a moment into a static snapshot for fast reference.

It is designed for situations where keeping guide pages open during gameplay causes unnecessary CPU and memory usage due to ads, scripts, and heavy DOM activity.

Freeze captures only what you need, only when you need it, and immediately stops all background activity.

---

## Problem

Many game guide and reference websites are heavy on ads and third-party scripts, continuously consuming CPU and memory.

During gameplay, users often need only a single moment of information (such as a map, a skill description, or a pattern image), not a live webpage running in the background.

---

## Core Concept

Freeze does not keep pages alive.

Freeze is intentionally designed around the idea of freezing a single visual moment instead of preserving or embedding a live webpage.

Key principles:
- No live page embedding
- No DOM or HTML extraction
- No background activity after capture
- Everything becomes a static image

---

## What Freeze v1 Does

- Open a URL in a new tab (convenience feature)
- Freeze a user-selected tab, window, or screen using the Screen Capture API
- Capture a single frame only
- Immediately stop the capture stream
- Display the frozen snapshot as a static image
- Allow drag-to-crop with user confirmation (destructive replace)
- Provide clear UI indicators for crop mode and instructions
- Remain lightweight with no external scripts or ads

---

## What Freeze v1 Explicitly Does NOT Do

Freeze v1 intentionally avoids the following:
- iframe-based browsing of other websites
- Automatic DOM or HTML freezing
- Browser extensions
- Always-on overlay windows
- OCR or text recognition
- Automation or game client control
- Monetization or tracking

These constraints are deliberate design decisions to respect browser security boundaries and keep the tool lightweight.

---

## Design Decisions

### Screen Capture API Only

Freeze uses the Screen Capture API (`getDisplayMedia`) exclusively.

Reasons:
- Respects cross-origin and browser security policies
- Requires explicit user approval
- Works with any website without embedding or scraping
- Avoids fragile or blocked techniques

---

### Single-Frame Capture and Immediate Stop

Only one frame is captured, and the media stream is stopped immediately after capture.

This minimizes CPU and memory usage and aligns with the concept of freezing a single moment.

---

### Destructive Crop with Confirmation

Crop operations replace the current snapshot instead of creating versions.

Reasons:
- Keeps state management simple
- Reduces UI and cognitive complexity
- Encourages fast re-freezing instead of undo stacks

A confirmation dialog is used to prevent accidental edits.

---

### Open Feature (Convenience, Not a Dependency)

The Open feature is provided as a convenience shortcut.

Freeze does not depend on pages being opened through the app. Any already-open tab or window can be frozen.

Freeze does not attempt to control or manage browser tab focus, as browsers intentionally restrict this behavior for security reasons.

---

## How to Use

1. Enter a URL and click Open (optional)
2. Return to the Freeze tab
3. Click Freeze
4. Select a tab, window, or screen to capture
5. A static snapshot appears immediately
6. Optionally click Crop, drag to select an area, and confirm

---

## User Interface Notes

- Crop mode clearly indicates whether it is ON or OFF
- Inline instructions guide the user during cropping
- Default browser image drag behavior is disabled to avoid interference

The UI intentionally avoids visual noise and unnecessary controls.

---

## Technology

- HTML
- CSS
- JavaScript
- Screen Capture API (`navigator.mediaDevices.getDisplayMedia`)
- Canvas API (single-frame capture and cropping)

No frameworks, extensions, or external libraries are used.

---

## Limitations

- Requires a modern browser (Chrome or Edge recommended)
- User must manually switch tabs after opening a URL
- Snapshot quality depends on the selected source and resolution

These limitations stem from browser security policies and are intentionally respected.

---

## Roadmap (Optional)

Possible future improvements beyond v1:
- Freeze history with thumbnail previews
- Local persistence using IndexedDB
- Clear history action
- Optional keyboard shortcuts

These items are explicitly out of scope for v1.

---

## License

This project is provided as a personal learning and portfolio project.

---

## Final Notes

Freeze v1 prioritizes clarity over cleverness, user consent over automation, and lightweight behavior over feature expansion.

If something goes wrong, the fastest solution is often to simply freeze again.
