/**
 * Centralized State Management
 * 
 * Single source of truth for all animation and interaction states.
 * All animation systems (scroll, hover, parallax, cursor) must read from this state.
 * 
 * Design Intent:
 * - Eliminate scattered magic numbers
 * - Enable runtime control of animation intensity
 * - Support graceful degradation based on device capabilities
 * - Provide clear control layer for experimentation
 */

const AppState = (function() {
    'use strict';

    // Private state object - single source of truth
    const state = {
        // Animation controls (0-1 scale for smooth transitions)
        animationIntensity: 1.0,        // Master intensity control
        
        // Feature toggles
        cursorEnabled: true,             // Custom cursor effects (desktop only)
        parallaxEnabled: true,           // Parallax scroll effects
        scrollAnimationsEnabled: true,   // Fade-in and scroll-based animations
        reducedMotionMode: false,        // Respects prefers-reduced-motion
        lowPerformanceMode: false,       // Simplified animations for low-end devices
        
        // Device capabilities (set during initialization)
        isTouchDevice: false,
        isSmallScreen: false,
        prefersReducedMotion: false,
        
        // Performance tracking
        devMode: false,                  // Enable dev tools and FPS counter
        fpsCounterVisible: false,
        
        // Cached values (updated during runtime)
        scrollY: 0,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
    };

    // Observers for state changes (allows systems to react to state updates)
    const observers = [];

    /**
     * Initialize state based on device capabilities
     * Detects touch devices, screen size, and user preferences
     */
    function initialize() {
        // Detect touch devices (disable cursor effects)
        state.isTouchDevice = ('ontouchstart' in window) || 
                             (navigator.maxTouchPoints > 0) || 
                             (navigator.msMaxTouchPoints > 0);
        
        // Detect small screens (reduce animation density)
        state.isSmallScreen = window.innerWidth < 768;
        
        // Detect prefers-reduced-motion (accessibility)
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        state.prefersReducedMotion = reducedMotionQuery.matches;
        
        // Listen for changes to reduced motion preference
        reducedMotionQuery.addEventListener('change', (e) => {
            state.prefersReducedMotion = e.matches;
            applyReducedMotionSettings();
            notifyObservers('prefersReducedMotion');
        });
        
        // Apply initial device-based degradation
        applyDeviceBasedDegradation();
        
        // Listen for window resize (update viewport cache)
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                state.viewportWidth = window.innerWidth;
                state.viewportHeight = window.innerHeight;
                state.isSmallScreen = window.innerWidth < 768;
                notifyObservers('resize');
            }, 150);
        });

        // Update scroll position cache
        window.addEventListener('scroll', () => {
            state.scrollY = window.pageYOffset || document.documentElement.scrollTop;
        }, { passive: true });
        
        console.log('[State] Initialized with capabilities:', {
            touch: state.isTouchDevice,
            smallScreen: state.isSmallScreen,
            reducedMotion: state.prefersReducedMotion
        });
    }

    /**
     * Apply device-based degradation
     * Automatically disable features that aren't suitable for the device
     */
    function applyDeviceBasedDegradation() {
        // Disable cursor effects on touch devices
        if (state.isTouchDevice) {
            state.cursorEnabled = false;
        }
        
        // Reduce animation density on small screens
        if (state.isSmallScreen) {
            state.animationIntensity = 0.7;
            state.parallaxEnabled = false;
        }
        
        // Apply reduced motion settings
        if (state.prefersReducedMotion) {
            applyReducedMotionSettings();
        }
    }

    /**
     * Apply reduced motion settings (accessibility)
     * Disables non-essential animations while maintaining usability
     */
    function applyReducedMotionSettings() {
        if (state.prefersReducedMotion) {
            state.reducedMotionMode = true;
            state.animationIntensity = 0.3;
            state.parallaxEnabled = false;
            state.scrollAnimationsEnabled = false;
            console.log('[State] Reduced motion mode enabled');
        }
    }

    /**
     * Toggle low performance mode
     * Can be toggled at runtime via keyboard shortcut
     */
    function toggleLowPerformanceMode() {
        state.lowPerformanceMode = !state.lowPerformanceMode;
        
        if (state.lowPerformanceMode) {
            // Aggressive degradation
            state.animationIntensity = 0.5;
            state.parallaxEnabled = false;
            state.cursorEnabled = false;
            console.log('[State] Low performance mode enabled');
        } else {
            // Restore based on device capabilities
            applyDeviceBasedDegradation();
            console.log('[State] Low performance mode disabled');
        }
        
        notifyObservers('lowPerformanceMode');
    }

    /**
     * Get current state (read-only)
     */
    function getState() {
        return Object.freeze({ ...state });
    }

    /**
     * Update state properties
     * @param {Object} updates - Object with properties to update
     */
    function updateState(updates) {
        const changedKeys = [];
        
        for (const key in updates) {
            if (state.hasOwnProperty(key) && state[key] !== updates[key]) {
                state[key] = updates[key];
                changedKeys.push(key);
            }
        }
        
        if (changedKeys.length > 0) {
            notifyObservers(changedKeys);
        }
    }

    /**
     * Toggle specific feature
     * @param {string} feature - Feature name (e.g., 'cursorEnabled')
     */
    function toggleFeature(feature) {
        if (typeof state[feature] === 'boolean') {
            state[feature] = !state[feature];
            console.log(`[State] ${feature}: ${state[feature]}`);
            notifyObservers([feature]);
            return state[feature];
        }
        return null;
    }

    /**
     * Register observer for state changes
     * @param {Function} callback - Called when state changes
     */
    function observe(callback) {
        observers.push(callback);
    }

    /**
     * Notify all observers of state changes
     * @param {string|Array} changedKeys - Keys that changed
     */
    function notifyObservers(changedKeys) {
        const keys = Array.isArray(changedKeys) ? changedKeys : [changedKeys];
        observers.forEach(callback => {
            try {
                callback(getState(), keys);
            } catch (error) {
                console.error('[State] Observer error:', error);
            }
        });
    }

    // Public API
    return {
        initialize,
        getState,
        updateState,
        toggleFeature,
        toggleLowPerformanceMode,
        observe
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AppState.initialize());
} else {
    AppState.initialize();
}
