import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  fallback: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  children: ReactNode;
}
interface State { error: Error | null }

// Still class-only: there is no hook equivalent of getDerivedStateFromError.
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  // Render phase: switch to the fallback UI.
  static getDerivedStateFromError(error: unknown): State {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }

  // Commit phase: side effects such as logging.
  override componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  reset = () => this.setState({ error: null });

  override render() {
    const { error } = this.state;
    return error ? this.props.fallback(error, this.reset) : this.props.children;
  }
}
