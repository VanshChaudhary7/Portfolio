/**
 * Centralized Animation System
 * 
 * Consolidates all animation logic into a single RAF loop.
 * Separates calculations from DOM mutations for better performance.
 * All animations respect centralized state controls.
 * 
 * Design Intent:
 * - Use ONE main RAF loop (avoid multiple competing loops)
 * - Separate calculation phase from DOM mutation phase
 * - Cache all DOM references (avoid repeated queries)
 * - Make all animations controllable via AppState
 * - Support graceful degradation
 * 
 * Performance Strategy:
 * Why single RAF loop: Multiple RAF loops can cause layout thrashing
 * and make frame timing unpredictable. A single loop gives us full
 * control over the render pipeline and enables proper batching of DOM
 * mutations.
 * 
 * Why separate calculations: Computing all values first, then applying
 * them in batch minimizes reflows. This follows the "read, then write"
 * pattern for optimal performance.
 */

const AnimationSystem = (function() {
    'use strict';

    // Cached DOM references (computed once, reused many times)
    const DOM = {
        navbar: null,
        sections: null,
        navLinks: null,
        animatedElements: null,
        navbarHeight: 0,
        sectionPositions: [], // Cache section positions
    };

    // Animation state (updated during calculation phase)
    const animState = {
        navbarOpacity: 0.95,
        activeSection: '',
        elementsToAnimate: [],
    };

    // RAF handle for cleanup
    let rafHandle = null;
    let isRunning = false;

    /**
     * Initialize animation system
     * Caches DOM references and starts main loop
     */
    function initialize() {
        if (isRunning) return;

        // Cache all DOM references
        cacheDOMReferences();

        // Start main animation loop
        startAnimationLoop();

        // Listen to state changes
        AppState.observe(handleStateChange);

        console.log('[Animations] System initialized');
    }

    /**
     * Cache DOM references
     * Query DOM once and reuse references
     */
    function cacheDOMReferences() {
        DOM.navbar = document.getElementById('navbar');
        DOM.sections = document.querySelectorAll('section[id]');
        DOM.navLinks = document.querySelectorAll('.nav-link');
        DOM.animatedElements = document.querySelectorAll('.skill-card, .project-card, .education-card');
        
        // Cache navbar height
        DOM.navbarHeight = DOM.navbar ? DOM.navbar.offsetHeight : 60;
        
        // Cache section positions
        DOM.sectionPositions = Array.from(DOM.sections).map(section => ({
            id: section.getAttribute('id'),
            top: section.offsetTop
        }));

        console.log('[Animations] DOM references cached:', {
            navbar: !!DOM.navbar,
            sections: DOM.sections.length,
            navLinks: DOM.navLinks.length,
            animatedElements: DOM.animatedElements.length
        });
    }

    /**
     * Update cached positions on resize
     * Called by state observer when viewport changes
     */
    function updateCachedPositions() {
        if (DOM.navbar) {
            DOM.navbarHeight = DOM.navbar.offsetHeight;
        }
        
        DOM.sectionPositions = Array.from(DOM.sections).map(section => ({
            id: section.getAttribute('id'),
            top: section.offsetTop
        }));
    }

    /**
     * Main animation loop
     * Single RAF loop that coordinates all animations
     */
    function startAnimationLoop() {
        if (isRunning) return;
        isRunning = true;

        function loop() {
            if (!isRunning) return;

            const state = AppState.getState();

            // PHASE 1: CALCULATIONS (read from DOM, compute values)
            // This phase should not modify the DOM
            if (state.scrollAnimationsEnabled && state.animationIntensity > 0) {
                calculateAnimations(state);
            }

            // PHASE 2: DOM MUTATIONS (write to DOM)
            // Batch all DOM updates together to minimize reflows
            if (state.scrollAnimationsEnabled && state.animationIntensity > 0) {
                applyAnimations(state);
            }

            // Update performance monitor
            PerformanceMonitor.update();

            // Continue loop
            rafHandle = requestAnimationFrame(loop);
        }

        rafHandle = requestAnimationFrame(loop);
        console.log('[Animations] Main loop started');
    }

    /**
     * CALCULATION PHASE
     * Read from DOM and compute what needs to change
     * Does NOT modify DOM (prevents layout thrashing)
     * 
     * Performance: Uses cached positions instead of reading offsetTop/offsetHeight
     * on every frame. Positions are recalculated only on resize.
     */
    function calculateAnimations(state) {
        const scrollY = state.scrollY; // Use cached scroll from state

        // Calculate navbar opacity based on scroll
        animState.navbarOpacity = scrollY > 50 ? 0.98 : 0.95;

        // Calculate active section using cached positions
        animState.activeSection = '';
        DOM.sectionPositions.forEach(section => {
            const sectionTop = section.top - DOM.navbarHeight - 100;
            if (scrollY >= sectionTop) {
                animState.activeSection = section.id;
            }
        });

        // Calculate which elements should be animated
        // Note: getBoundingClientRect is necessary here for scroll-based visibility
        // This is acceptable because we batch all reads before any writes
        animState.elementsToAnimate = [];
        if (state.scrollAnimationsEnabled) {
            DOM.animatedElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible) {
                    // Calculate animation intensity based on state
                    const opacity = state.animationIntensity;
                    const translateY = (1 - state.animationIntensity) * 20; // Scale movement
                    
                    animState.elementsToAnimate.push({
                        element,
                        opacity,
                        translateY
                    });
                }
            });
        }
    }

    /**
     * DOM MUTATION PHASE
     * Apply all calculated changes to DOM at once
     * Batching reduces reflows and improves performance
     * 
     * Performance: Only updates elements when values change
     */
    function applyAnimations(state) {
        // Update navbar background only if it changed
        if (DOM.navbar) {
            const newBgColor = `rgba(10, 10, 10, ${animState.navbarOpacity})`;
            if (DOM.navbar.style.backgroundColor !== newBgColor) {
                DOM.navbar.style.backgroundColor = newBgColor;
            }
        }

        // Update active nav link
        DOM.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const shouldBeActive = href === `#${animState.activeSection}`;
            const isActive = link.classList.contains('active');
            
            if (shouldBeActive && !isActive) {
                link.classList.add('active');
            } else if (!shouldBeActive && isActive) {
                link.classList.remove('active');
            }
        });

        // Apply element animations only to elements that need updates
        animState.elementsToAnimate.forEach(({ element, opacity, translateY }) => {
            const currentOpacity = element.style.opacity;
            const newOpacity = String(opacity);
            const newTransform = `translateY(${translateY}px)`;
            
            // Only update if values changed
            if (currentOpacity !== newOpacity) {
                element.style.opacity = newOpacity;
            }
            if (element.style.transform !== newTransform) {
                element.style.transform = newTransform;
            }
        });
    }

    /**
     * Handle state changes
     * React to changes in AppState
     */
    function handleStateChange(state, changedKeys) {
        // If animations are completely disabled, reset elements
        if (!state.scrollAnimationsEnabled) {
            resetAnimations();
        }

        // If viewport size changed, recalculate cached positions
        if (changedKeys.includes('resize')) {
            updateCachedPositions();
        }

        // If low performance mode is enabled, reduce complexity
        if (state.lowPerformanceMode) {
            console.log('[Animations] Low performance mode active');
        }
    }

    /**
     * Reset all animations to default state
     */
    function resetAnimations() {
        DOM.animatedElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    /**
     * Stop animation loop
     * For cleanup or when animations are disabled
     */
    function stop() {
        if (!isRunning) return;
        
        if (rafHandle) {
            cancelAnimationFrame(rafHandle);
            rafHandle = null;
        }
        
        isRunning = false;
        resetAnimations();
        
        console.log('[Animations] Main loop stopped');
    }

    // Public API
    return {
        initialize,
        stop
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AnimationSystem.initialize());
} else {
    AnimationSystem.initialize();
}
