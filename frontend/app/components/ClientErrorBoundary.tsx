"use client";
import React from "react";

export default class ClientErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { err?: Error }
> {
  state = { err: undefined as Error | undefined };
  static getDerivedStateFromError(err: Error) { return { err }; }
  componentDidCatch(err: Error, info: any) { console.error("Client crash:", err, info); }
  render() {
    if (this.state.err) {
      return (
        <div style={{padding:16}}>
          <h2>Client-Fehler</h2>
          <pre>{String(this.state.err)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
