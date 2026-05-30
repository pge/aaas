// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initSmoothScrolling();
    initContactForm();
});

// ===== NAVIGATION =====
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');

    // Toggle the mobile menu
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach((link) => {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // Navbar scroll effect: add a subtle shadow after scrolling past 100px
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
            }
        });
    }
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
        link.addEventListener('click', function (e) {
            // Only handle internal links
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth',
                });
            }
        });
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validateForm()) {
            submitForm();
        }
    });

    // Real‑time validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach((input) => {
        input.addEventListener('blur', function () {
            validateField(this);
        });
        input.addEventListener('input', function () {
            removeFieldError(this);
        });
    });
}

function validateForm() {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    requiredFields.forEach((field) => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    removeFieldError(field);

    // Check required
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Dieses Feld ist erforderlich.');
        return false;
    }

    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Bitte geben Sie eine gültige E‑Mail‑Adresse ein.');
            return false;
        }
    }

    // Message length
    if (fieldName === 'message' && value.length < 10) {
        showFieldError(field, 'Bitte geben Sie eine Nachricht mit mindestens 10 Zeichen ein.');
        return false;
    }

    return true;
}

function showFieldError(field, message) {
    removeFieldError(field);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = getComputedStyle(document.documentElement).getPropertyValue('--error');
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    field.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--error');
    field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
    field.parentNode.appendChild(errorDiv);
}

function removeFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) errorDiv.remove();
    field.style.borderColor = '';
    field.style.boxShadow = '';
}

function submitForm() {
    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wird gesendet...';
    submitButton.disabled = true;
    // Simulated submit
    setTimeout(() => {
        showNotification('Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns in Kürze bei Ihnen.', 'success');
        form.reset();
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.notification');
    existing.forEach((n) => n.remove());
    // Create container
    const notif = document.createElement('div');
    notif.className = `notification notification-${type}`;
    notif.textContent = message;
    notif.style.position = 'fixed';
    notif.style.top = '1rem';
    notif.style.right = '1rem';
    notif.style.background = '#fff';
    notif.style.border = '1px solid var(--border-color)';
    notif.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    notif.style.padding = '1rem';
    notif.style.borderRadius = '8px';
    notif.style.color = '#0a1f33';
    notif.style.zIndex = '9999';
    document.body.appendChild(notif);
    // Auto‑remove after 5 seconds
    setTimeout(() => {
        notif.remove();
    }, 5000);
}
