"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { TerminalCursor } from "@/components/TerminalCursor";

type BState = { hasError: boolean };

class CursorErrorBoundary extends Component<
  { children: ReactNode },
  BState
> {
  state: BState = { hasError: false };

  static getDerivedStateFromError(): BState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("[TerminalCursor]", error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

/** Wraps cursor so a Framer/GSAP bug cannot brick the whole app or hide the system pointer forever. */
export function CursorMount() {
  return (
    <CursorErrorBoundary>
      <TerminalCursor />
    </CursorErrorBoundary>
  );
}
