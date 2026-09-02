import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Duchess Hairline application error:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="min-h-screen grid place-items-center bg-warm-white px-5 text-center">
        <div className="max-w-md rounded-3xl bg-white p-8 shadow-xl border border-beige/30">
          <p className="label-text text-charcoal/50">Duchess Hairline</p>
          <h1 className="mt-3 font-display text-4xl font-light text-deep-black">Something needs a refresh.</h1>
          <p className="mt-4 text-sm leading-6 text-charcoal/60">The page hit an unexpected error. Refresh the page and try again.</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-7 rounded-full bg-deep-black px-6 py-3 text-sm text-white">Refresh page</button>
        </div>
      </main>
    );
  }
}
