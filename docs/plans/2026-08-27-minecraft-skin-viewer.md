# Minecraft Skin Viewer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a configuration-driven `/minecraft-skin-viewer` tool page that previews existing Java and Bedrock skin PNG files in 2D and 3D.

**Architecture:** Reuse the global Navbar, Footer, Container, Button, Accordion, and the established dark Minecraft Skin Workshop visual system. Add a small pure validation module, a viewer-specific configuration file, and one business component that owns upload and preview state. Keep the homepage as the image-conversion intent owner and the new route as the existing-skin viewing intent owner.

**Tech Stack:** TanStack Start, React 19, Tailwind CSS v4, skinview3d, Vitest, Playwright.

---

### Task 1: Define viewer validation

- Add unit coverage for PNG MIME validation and 64x64/128x128 dimensions.
- Implement a pure inspector that returns Java or Bedrock metadata.

### Task 2: Build the viewer workspace

- Add configured copy, formats, limits, model modes, FAQ, and page sections.
- Add upload, sample, reset, 2D texture, 3D preview, and explicit error states.
- Use skinview3d auto-detection with Classic and Slim overrides.

### Task 3: Add the public route

- Add canonical metadata and WebApplication/BreadcrumbList structured data.
- Compose Hero, workspace, how-to, compatibility, FAQ, and converter CTA.
- Add Navbar/Footer links and sitemap entry.

### Task 4: Verify

- Update the E2E catalog and add a focused Viewer journey.
- Run unit checks, production build, desktop/mobile UI verification, and the focused E2E spec.
