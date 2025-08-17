/**
 * SplitText Animation Component
 * Creates GSAP animations for text splitting
 */

class SplitText {
    constructor(options) {
        this.element = options.element;
        this.text = options.text || this.element.textContent;
        this.className = options.className || '';
        this.delay = options.delay || 100;
        this.duration = options.duration || 0.6;
        this.ease = options.ease || 'power3.out';
        this.splitType = options.splitType || 'chars';
        this.from = options.from || { opacity: 0, y: 40 };
        this.to = options.to || { opacity: 1, y: 0 };
        this.threshold = options.threshold || 0.1;
        this.rootMargin = options.rootMargin || '-100px';
        this.textAlign = options.textAlign || 'center';
        this.onLetterAnimationComplete = options.onLetterAnimationComplete;
        this.repeat = options.repeat || false;
        this.repeatDelay = options.repeatDelay || 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        this.setupElement();
        this.splitTextIntoSpans();
        this.setupIntersectionObserver();
    }
    
    setupElement() {
        if (this.className) {
            this.element.className = this.className;
        }
        this.element.style.textAlign = this.textAlign;
    }
    
    splitTextIntoSpans() {
        const chars = this.text.split('');
        this.element.innerHTML = '';
        
        this.spans = chars.map((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char; // Non-breaking space
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = `translateY(${this.from.y}px)`;
            span.style.transition = 'none';
            span.setAttribute('data-char-index', index);
            
            this.element.appendChild(span);
            return span;
        });
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate();
                    observer.unobserve(this.element);
                }
            });
        }, {
            threshold: this.threshold,
            rootMargin: this.rootMargin
        });
        
        observer.observe(this.element);
    }
    
    animate() {
        // Set initial state
        gsap.set(this.spans, this.from);
        
        // Animate each character
        gsap.to(this.spans, {
            ...this.to,
            duration: this.duration,
            ease: this.ease,
            stagger: this.delay / 1000, // Convert ms to seconds
            onComplete: () => {
                if (this.onLetterAnimationComplete) {
                    this.onLetterAnimationComplete();
                }
                
                // If repeat is enabled, schedule next animation
                if (this.repeat) {
                    setTimeout(() => {
                        this.resetAndAnimate();
                    }, this.repeatDelay);
                }
            }
        });
    }
    
    resetAndAnimate() {
        // Reset to initial state
        gsap.set(this.spans, this.from);
        
        // Animate again
        gsap.to(this.spans, {
            ...this.to,
            duration: this.duration,
            ease: this.ease,
            stagger: this.delay / 1000,
            onComplete: () => {
                if (this.onLetterAnimationComplete) {
                    this.onLetterAnimationComplete();
                }
                
                // Continue repeating
                if (this.repeat) {
                    setTimeout(() => {
                        this.resetAndAnimate();
                    }, this.repeatDelay);
                }
            }
        });
    }
    
    // Static method to create instance
    static create(selector, options = {}) {
        const element = typeof selector === 'string' 
            ? document.querySelector(selector) 
            : selector;
            
        if (!element) {
            console.error('SplitText: Element not found');
            return null;
        }
        
        return new SplitText({
            element,
            ...options
        });
    }
}

// Export for use
window.SplitText = SplitText;