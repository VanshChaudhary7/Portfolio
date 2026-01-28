/**
 * Performance Instrumentation (Dev Mode Only)
 * 
 * Provides FPS counter and performance monitoring for development.
 * Helps measure impact of animation systems.
 * 
 * Design Intent:
 * - Measure real-time performance impact
 * - Help identify performance bottlenecks
 * - Enable data-driven optimization decisions
 */

const PerformanceMonitor = (function() {
    'use strict';

    let fps = 0;
    let frameCount = 0;
    let lastTime = performance.now();
    let fpsElement = null;
    let isMonitoring = false;

    /**
     * Initialize FPS counter UI
     * Creates overlay element for displaying FPS
     */
    function initializeFPSCounter() {
        if (fpsElement) return;

        fpsElement = document.createElement('div');
        fpsElement.id = 'fps-counter';
        fpsElement.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(0, 0, 0, 0.85);
            color: #00ff00;
            padding: 10px 15px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            z-index: 10000;
            border: 1px solid #00ff00;
            display: none;
            min-width: 120px;
        `;
        fpsElement.innerHTML = '<div>FPS: <span id="fps-value">--</span></div>';
        document.body.appendChild(fpsElement);
        
        console.log('[Performance] FPS counter initialized');
    }

    /**
     * Update FPS calculation
     * Called from main RAF loop
     */
    function updateFPS() {
        if (!isMonitoring) return;

        frameCount++;
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTime;

        // Update FPS every second
        if (deltaTime >= 1000) {
            fps = Math.round((frameCount * 1000) / deltaTime);
            frameCount = 0;
            lastTime = currentTime;

            // Update display
            if (fpsElement && fpsElement.style.display !== 'none') {
                const fpsValue = document.getElementById('fps-value');
                if (fpsValue) {
                    fpsValue.textContent = fps;
                    
                    // Color code based on performance
                    if (fps >= 55) {
                        fpsValue.style.color = '#00ff00'; // Good
                    } else if (fps >= 30) {
                        fpsValue.style.color = '#ffff00'; // Warning
                    } else {
                        fpsValue.style.color = '#ff0000'; // Poor
                    }
                }
            }
        }
    }

    /**
     * Toggle FPS counter visibility
     */
    function toggleFPSCounter() {
        if (!fpsElement) {
            initializeFPSCounter();
        }

        const isVisible = fpsElement.style.display !== 'none';
        fpsElement.style.display = isVisible ? 'none' : 'block';
        isMonitoring = !isVisible;

        console.log(`[Performance] FPS counter ${isMonitoring ? 'enabled' : 'disabled'}`);
        return isMonitoring;
    }

    /**
     * Get current FPS
     * @returns {number} Current frames per second
     */
    function getFPS() {
        return fps;
    }

    /**
     * Log performance mark
     * Useful for measuring specific operations
     */
    function mark(label) {
        if (performance.mark) {
            performance.mark(label);
        }
    }

    /**
     * Measure performance between two marks
     */
    function measure(name, startMark, endMark) {
        if (performance.measure) {
            try {
                performance.measure(name, startMark, endMark);
                const measure = performance.getEntriesByName(name)[0];
                console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`);
            } catch (e) {
                console.warn('[Performance] Measure failed:', e.message);
            }
        }
    }

    // Public API
    return {
        initialize: initializeFPSCounter,
        update: updateFPS,
        toggle: toggleFPSCounter,
        getFPS,
        mark,
        measure
    };
})();
