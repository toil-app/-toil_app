type ToastType = 'info' | 'success' | 'error';

type ToastOptions = {
    type?: ToastType;
    durationMs?: number;
};

type ToastHandler = (message: string, options?: ToastOptions) => void;

class ToastService {
    private handler: ToastHandler | null = null;

    /**
     * Register the toast handler (called by ToastProvider)
     */
    setHandler(handler: ToastHandler) {
        this.handler = handler;
    }

    /**
     * Show a toast message from anywhere in the app
     */
    show(message: string, options?: ToastOptions) {
        if (this.handler) {
            this.handler(message, options);
        } else {
            console.warn('[ToastService] No handler registered. Message:', message);
        }
    }

    /**
     * Convenience methods
     */
    info(message: string, durationMs?: number) {
        this.show(message, { type: 'info', durationMs });
    }

    success(message: string, durationMs?: number) {
        this.show(message, { type: 'success', durationMs });
    }

    error(message: string, durationMs?: number) {
        this.show(message, { type: 'error', durationMs });
    }
}

export default new ToastService();
