/**
 * Keyboard Controls (Dev Mode)
 * 
 * Provides keyboard shortcuts for toggling animation systems.
 * Enables real-time experimentation and performance comparison.
 * 
 * Keyboard Shortcuts:
 * - C: Toggle cursor effects
 * - P: Toggle parallax effects
 * - A: Toggle all animations
 * - L: Toggle low-performance mode
 * - F: Toggle FPS counter (dev mode only)
 * 
 * Design Intent:
 * - Enable rapid A/B testing of animation systems
 * - Facilitate performance impact measurement
 * - Support runtime debugging and optimization
 */

const KeyboardControls = (function() {
    'use strict';

    let isInitialized = false;
    let notificationTimeout = null;

    /**
     * Initialize keyboard controls
     * Sets up event listeners for keyboard shortcuts
     */
    function initialize() {
        if (isInitialized) return;

        document.addEventListener('keydown', handleKeyPress);
        isInitialized = true;
        
        console.log('[Controls] Keyboard shortcuts initialized');
        console.log('[Controls] C=Cursor, P=Parallax, A=All Animations, L=Low Perf, F=FPS');
    }

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} event
     */
    function handleKeyPress(event) {
        // Ignore if user is typing in an input field
        if (event.target.matches('input, textarea, select')) {
            return;
        }

        const key = event.key.toLowerCase();
        let message = null;
        let action = null;

        switch (key) {
            case 'c':
                // Toggle cursor effects
                action = AppState.toggleFeature('cursorEnabled');
                message = `Cursor Effects: ${action ? 'ON' : 'OFF'}`;
                console.log(`[Controls] ${message}`);
                break;

            case 'p':
                // Toggle parallax effects
                action = AppState.toggleFeature('parallaxEnabled');
                message = `Parallax Effects: ${action ? 'ON' : 'OFF'}`;
                console.log(`[Controls] ${message}`);
                break;

            case 'a':
                // Toggle all animations
                action = AppState.toggleFeature('scrollAnimationsEnabled');
                message = `All Animations: ${action ? 'ON' : 'OFF'}`;
                console.log(`[Controls] ${message}`);
                break;

            case 'l':
                // Toggle low-performance mode
                AppState.toggleLowPerformanceMode();
                const state = AppState.getState();
                message = `Low Performance Mode: ${state.lowPerformanceMode ? 'ON' : 'OFF'}`;
                console.log(`[Controls] ${message}`);
                break;

            case 'f':
                // Toggle FPS counter (dev mode only)
                const fpsEnabled = PerformanceMonitor.toggle();
                message = `FPS Counter: ${fpsEnabled ? 'ON' : 'OFF'}`;
                console.log(`[Controls] ${message}`);
                break;

            default:
                return; // Not a control key, exit
        }

        // Show visual notification
        if (message) {
            showNotification(message);
        }
    }

    /**
     * Show temporary on-screen notification
     * Provides visual feedback for keyboard controls
     * @param {string} message
     */
    function showNotification(message) {
        // Clear existing notification
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }

        // Get or create notification element
        let notification = document.getElementById('control-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'control-notification';
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(59, 130, 246, 0.95);
                color: white;
                padding: 20px 40px;
                border-radius: 10px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                font-size: 18px;
                font-weight: 600;
                z-index: 10001;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            `;
            document.body.appendChild(notification);
        }

        // Update message and show
        notification.textContent = message;
        notification.style.opacity = '1';

        // Hide after 2 seconds
        notificationTimeout = setTimeout(() => {
            notification.style.opacity = '0';
        }, 2000);
    }

    /**
     * Destroy keyboard controls
     * Clean up event listeners
     */
    function destroy() {
        if (!isInitialized) return;

        document.removeEventListener('keydown', handleKeyPress);
        isInitialized = false;
        
        console.log('[Controls] Keyboard shortcuts destroyed');
    }

    // Public API
    return {
        initialize,
        destroy
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => KeyboardControls.initialize());
} else {
    KeyboardControls.initialize();
}
