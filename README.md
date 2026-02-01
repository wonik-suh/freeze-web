# Freeze Web

Freeze Web is a lightweight, web-based tool designed to reduce resource usage during gameplay by turning heavy web pages into static snapshots.

Instead of keeping ad-heavy guide sites open in the background, users can freeze the exact moment they need and view it as a static image with near-zero CPU and memory usage.

---

## Problem

During games, especially competitive or resource-sensitive ones, keeping guide websites open (e.g. item builds, comps, references) often causes:

- High CPU usage from ads and scripts
- Increased memory consumption
- Frame drops and overall performance degradation

Existing solutions typically require leaving the page fully active in the background, even when the content itself is static.

---

## Core Idea

**Freeze the page, not the tab.**

Freeze Web does not attempt to keep the original webpage alive.  
Instead, it captures the exact moment the user needs and replaces the live page with a static snapshot.

This drastically reduces resource usage while preserving the information the player actually cares about.

---

## Why Not iframe or DOM Freezing?

Several naïve approaches were intentionally rejected:

- **iframe embedding**  
  Most modern websites block iframe usage via security headers (CSP, X-Frame-Options).

- **DOM / HTML freezing**  
  Cross-origin policies prevent accessing or serializing third-party page content safely.

- **Automatic background capture**  
  Disallowed by browser security models without explicit user permission.

Freeze Web respects browser security constraints instead of working around them.

---

## Solution (v1)

Freeze Web uses the **Screen Capture API** with explicit user consent.

### Flow
1. User enters a URL and opens it in a new tab
2. User navigates to the desired state of the page
3. User clicks **Freeze**
4. Browser asks which tab/window to capture (user-approved)
5. A single-frame snapshot is captured
6. The live connection is immediately terminated
7. The frozen snapshot is displayed as a static image

---

## Features (v1)

- URL launcher (opens target site in a new tab)
- One-click Freeze button
- User-approved screen/tab capture
- Static image viewer
- Freeze history with thumbnails
- Minimal, ad-free UI

---

## Explicit Non-Goals

To keep v1 focused and achievable, the following are intentionally out of scope:

- Browser extensions
- Always-on-top overlays
- DOM inspection or OCR
- Automatic content extraction
- Game client interaction
- Commercialization or monetization

---

## Design Philosophy

- Respect browser security models
- Prefer explicit user consent over automation
- Optimize for simplicity and reliability
- Finish a small, well-defined tool instead of an over-scoped system

---

## Future Directions (Non-v1)

- Browser extension for true in-tab freezing
- Annotation and highlighting on frozen snapshots
- Lightweight reader / info-extraction mode
- Comparison view between multiple freezes

These are intentionally deferred to keep v1 lightweight and complete.

---

## Tech Stack

- HTML / CSS / JavaScript
- Screen Capture API
- No external frameworks required

---

## Status

Current version: **v1 (Web, Screen Capture–based)**  
This project is designed as a focused frontend portfolio piece demonstrating problem definition, constraint-aware design, and intentional scope control.
