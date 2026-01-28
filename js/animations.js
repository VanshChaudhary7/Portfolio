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

        console.log('[Animations] DOM references cached:', {
            navbar: !!DOM.navbar,
            sections: DOM.sections.length,
            navLinks: DOM.navLinks.length,
            animatedElements: DOM.animatedElements.length
        });
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
     */
    function calculateAnimations(state) {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const navbarHeight = DOM.navbar ? DOM.navbar.offsetHeight : 60;

        // Calculate navbar opacity based on scroll
        animState.navbarOpacity = scrollY > 50 ? 0.98 : 0.95;

        // Calculate active section
        animState.activeSection = '';
        DOM.sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            if (scrollY >= sectionTop) {
                animState.activeSection = section.getAttribute('id');
            }
        });

        // Calculate which elements should be animated
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
     */
    function applyAnimations(state) {
        // Update navbar background
        if (DOM.navbar) {
            DOM.navbar.style.backgroundColor = `rgba(10, 10, 10, ${animState.navbarOpacity})`;
        }

        // Update active nav link
        DOM.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${animState.activeSection}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Apply element animations
        animState.elementsToAnimate.forEach(({ element, opacity, translateY }) => {
            element.style.opacity = opacity;
            element.style.transform = `translateY(${translateY}px)`;
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
