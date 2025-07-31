// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.theme);
        this.bindEvents();
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateThemeButton();
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    updateThemeButton() {
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            const moonIcon = themeBtn.querySelector('.fa-moon');
            const sunIcon = themeBtn.querySelector('.fa-sun');
            
            if (this.theme === 'dark') {
                moonIcon.style.opacity = '0';
                moonIcon.style.transform = 'rotate(180deg)';
                sunIcon.style.opacity = '1';
                sunIcon.style.transform = 'rotate(0deg)';
            } else {
                moonIcon.style.opacity = '1';
                moonIcon.style.transform = 'rotate(0deg)';
                sunIcon.style.opacity = '0';
                sunIcon.style.transform = 'rotate(180deg)';
            }
        }
    }

    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleResponsiveNav();
    }

    bindEvents() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (hamburger && navMenu && 
                !hamburger.contains(e.target) && 
                !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    handleResponsiveNav() {
        // Add responsive navigation styles
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .hamburger.active span:nth-child(1) {
                    transform: rotate(-45deg) translate(-5px, 6px);
                }
                .hamburger.active span:nth-child(2) {
                    opacity: 0;
                }
                .hamburger.active span:nth-child(3) {
                    transform: rotate(45deg) translate(-5px, -6px);
                }
                
                .nav-menu {
                    position: fixed;
                    left: -100%;
                    top: 4rem;
                    flex-direction: column;
                    background-color: var(--bg-primary);
                    width: 100%;
                    text-align: center;
                    transition: 0.3s;
                    box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
                    border-top: 1px solid var(--border-light);
                    padding: var(--spacing-lg) 0;
                }
                
                .nav-menu.active {
                    left: 0;
                }
                
                .nav-links {
                    flex-direction: column;
                    gap: var(--spacing-lg);
                    margin-bottom: var(--spacing-lg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Task Management
class TaskManager {
    constructor() {
        this.selectedTaskId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initModals();
    }

    bindEvents() {
        // Task form validation
        const taskForms = document.querySelectorAll('.task-form');
        taskForms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleTaskSubmit(e));
        });

        // Priority selection
        const priorityOptions = document.querySelectorAll('.priority-option');
        priorityOptions.forEach(option => {
            option.addEventListener('click', () => {
                const input = option.querySelector('input');
                if (input) {
                    input.checked = true;
                    this.updatePrioritySelection();
                }
            });
        });
    }

    handleTaskSubmit(e) {
        const form = e.target;
        const formData = new FormData(form);
        
        // Basic validation
        const title = formData.get('title');
        const dueDate = formData.get('due_date');
        
        if (!title || title.trim().length < 3) {
            e.preventDefault();
            this.showNotification('Task title must be at least 3 characters long', 'error');
            return false;
        }
        
        if (!dueDate) {
            e.preventDefault();
            this.showNotification('Due date is required', 'error');
            return false;
        }
        
        // Check if due date is in the past
        const selectedDate = new Date(dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            const confirmPast = confirm('The selected due date is in the past. Are you sure you want to continue?');
            if (!confirmPast) {
                e.preventDefault();
                return false;
            }
        }
        
        this.showNotification('Task saved successfully!', 'success');
    }

    updatePrioritySelection() {
        const priorityOptions = document.querySelectorAll('.priority-option');
        priorityOptions.forEach(option => {
            const input = option.querySelector('input');
            const indicator = option.querySelector('.priority-indicator');
            
            if (input && indicator) {
                if (input.checked) {
                    indicator.style.borderColor = 'var(--primary-color)';
                    indicator.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
                } else {
                    indicator.style.borderColor = 'var(--border-light)';
                    indicator.style.backgroundColor = 'transparent';
                }
            }
        });
    }

    initModals() {
        // Initialize all modals
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const closeBtn = modal.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal(modal.id));
            }
            
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
        
        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.show');
                if (openModal) {
                    this.closeModal(openModal.id);
                }
            }
        });
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-primary);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-lg);
            padding: var(--spacing-md) var(--spacing-lg);
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
        `;
        
        // Type-specific styling
        const colors = {
            success: 'var(--success-color)',
            error: 'var(--error-color)',
            warning: 'var(--warning-color)',
            info: 'var(--info-color)'
        };
        
        notification.style.borderLeftColor = colors[type];
        notification.style.borderLeftWidth = '4px';
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.removeNotification(notification));
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
    }

    removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Global Task Functions (for template usage)
function viewTask(taskId) {
    // In a real app, this would navigate to the task detail page
    // For now, we'll just redirect to a placeholder URL
    window.location.href = `/tasks/${taskId}/`;
}

function editTask(taskId, event) {
    if (event) {
        event.stopPropagation();
    }
    // Navigate to edit page
    window.location.href = `/tasks/${taskId}/edit/`;
}

function confirmDelete(taskId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    const taskManager = window.taskManager;
    if (taskManager) {
        taskManager.selectedTaskId = taskId;
        taskManager.showModal('deleteModal');
    }
}

function closeDeleteModal() {
    const taskManager = window.taskManager;
    if (taskManager) {
        taskManager.closeModal('deleteModal');
    }
}

function deleteTask() {
    const taskManager = window.taskManager;
    if (taskManager && taskManager.selectedTaskId) {
        // In a real app, this would make an API call to delete the task
        console.log(`Deleting task ${taskManager.selectedTaskId}`);
        
        // Show success notification
        taskManager.showNotification('Task deleted successfully!', 'success');
        
        // Close modal
        taskManager.closeModal('deleteModal');
        
        // In a real app, remove the task from the DOM or refresh the page
        // For demo purposes, we'll just fade out the task card
        const taskCard = document.querySelector(`[onclick="viewTask(${taskManager.selectedTaskId})"]`);
        if (taskCard) {
            taskCard.style.transition = 'opacity 0.3s ease-out';
            taskCard.style.opacity = '0';
            setTimeout(() => {
                if (taskCard.parentNode) {
                    taskCard.parentNode.removeChild(taskCard);
                }
            }, 300);
        }
        
        taskManager.selectedTaskId = null;
    }
}

function markAsProgress(taskId) {
    const taskManager = window.taskManager;
    if (taskManager) {
        taskManager.selectedTaskId = taskId;
        taskManager.showModal('statusModal');
    }
}

function markAsCompleted(taskId) {
    const taskManager = window.taskManager;
    if (taskManager) {
        taskManager.selectedTaskId = taskId;
        taskManager.showModal('statusModal');
    }
}

function closeStatusModal() {
    const taskManager = window.taskManager;
    if (taskManager) {
        taskManager.closeModal('statusModal');
    }
}

function updateStatus() {
    const taskManager = window.taskManager;
    if (taskManager && taskManager.selectedTaskId) {
        // In a real app, this would make an API call to update the task status
        console.log(`Updating status for task ${taskManager.selectedTaskId}`);
        
        // Show success notification
        taskManager.showNotification('Task status updated successfully!', 'success');
        
        // Close modal
        taskManager.closeModal('statusModal');
        
        taskManager.selectedTaskId = null;
    }
}

// Google Sign-In Integration
function signInWithGoogle() {
    // In a real app, this would integrate with Google OAuth
    console.log('Google Sign-In clicked');
    
    // For demo purposes, show a notification
    const taskManager = window.taskManager;
    if (taskManager) {
        taskManager.showNotification('Google Sign-In integration would be implemented here', 'info');
    }
}

// Form Enhancements
class FormEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.enhanceInputs();
        this.addDateValidation();
    }

    enhanceInputs() {
        // Add floating label effect
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Add focus and blur event listeners for enhanced styling
            input.addEventListener('focus', () => {
                const formGroup = input.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.add('focused');
                }
            });

            input.addEventListener('blur', () => {
                const formGroup = input.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.remove('focused');
                    
                    // Add 'filled' class if input has value
                    if (input.value.trim() !== '') {
                        formGroup.classList.add('filled');
                    } else {
                        formGroup.classList.remove('filled');
                    }
                }
            });

            // Check initial value
            if (input.value.trim() !== '') {
                const formGroup = input.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.add('filled');
                }
            }
        });
    }

    addDateValidation() {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            if (!input.hasAttribute('min')) {
                input.setAttribute('min', today);
            }

            input.addEventListener('change', () => {
                const selectedDate = new Date(input.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (selectedDate < today) {
                    input.style.borderColor = 'var(--warning-color)';
                    
                    // Show warning tooltip
                    this.showTooltip(input, 'Due date is in the past', 'warning');
                } else {
                    input.style.borderColor = 'var(--success-color)';
                    this.hideTooltip(input);
                }
            });
        });
    }

    showTooltip(element, message, type = 'info') {
        // Remove existing tooltip
        this.hideTooltip(element);

        const tooltip = document.createElement('div');
        tooltip.className = `tooltip tooltip-${type}`;
        tooltip.textContent = message;
        tooltip.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: var(--bg-dark);
            color: var(--text-white);
            padding: var(--spacing-sm) var(--spacing-md);
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            white-space: nowrap;
            z-index: 1000;
            margin-bottom: 5px;
            pointer-events: none;
        `;

        // Add arrow
        const arrow = document.createElement('div');
        arrow.style.cssText = `
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid var(--bg-dark);
        `;
        tooltip.appendChild(arrow);

        // Position relative to form group
        const formGroup = element.closest('.form-group');
        if (formGroup) {
            formGroup.style.position = 'relative';
            formGroup.appendChild(tooltip);
        }

        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.hideTooltip(element);
        }, 3000);
    }

    hideTooltip(element) {
        const formGroup = element.closest('.form-group');
        if (formGroup) {
            const tooltip = formGroup.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        }
    }
}

// Animation and Scroll Effects
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.addScrollAnimations();
        this.addHoverEffects();
        this.addLoadingStates();
    }

    addScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements that should animate on scroll
        const animateElements = document.querySelectorAll('.feature-card, .task-card, .stat-card');
        animateElements.forEach(el => {
            observer.observe(el);
        });

        // Add CSS for scroll animations
        const style = document.createElement('style');
        style.textContent = `
            .feature-card,
            .task-card,
            .stat-card {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease-out, transform 0.6s ease-out;
            }
            
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            .feature-card:nth-child(even) {
                transition-delay: 0.1s;
            }
            
            .feature-card:nth-child(3n) {
                transition-delay: 0.2s;
            }
        `;
        document.head.appendChild(style);
    }

    addHoverEffects() {
        // Add enhanced hover effects for cards
        const cards = document.querySelectorAll('.task-card, .feature-card, .stat-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    addLoadingStates() {
        // Add loading states for buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Only add loading state for form submissions
                if (button.type === 'submit') {
                    this.addLoadingState(button);
                }
            });
        });
    }

    addLoadingState(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        button.disabled = true;

        // Remove loading state after form submission (simulated)
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    window.themeManager = new ThemeManager();
    window.navigationManager = new NavigationManager();
    window.taskManager = new TaskManager();
    window.formEnhancer = new FormEnhancer();
    window.animationManager = new AnimationManager();

    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus search (if implemented)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[type="search"]');
            if (searchInput) {
                searchInput.focus();
            }
        }

        // Escape to close any open dropdowns or modals
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal && window.taskManager) {
                window.taskManager.closeModal(openModal.id);
            }
        }
    });

    console.log('TaskHero initialized successfully! 🚀');
});

// Utility Functions
const Utils = {
    // Format date for display
    formatDate(date) {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        return new Date(date).toLocaleDateString('en-US', options);
    },

    // Calculate days until due date
    daysUntilDue(dueDate) {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    // Debounce function for search/filter inputs
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Generate random ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },

    // Validate email
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
};

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, NavigationManager, TaskManager, FormEnhancer, AnimationManager, Utils };
}

     
const statusMessage = document.getElementById('statusMessage');

const updateStatusMessage = (isOnline) => {
    if (isOnline) {
        statusMessage.textContent = 'You are back online!';
        statusMessage.style.backgroundColor = '#4CAF50'; // Green for online
    } else {
        statusMessage.textContent = 'You are offline. Please check your internet connection.';
        statusMessage.style.backgroundColor = '#f44336'; // Red for offline
    }
    statusMessage.style.display = 'block';

    // Hide the message after 3 seconds
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 3000);
};

// Initial check
updateStatusMessage(navigator.onLine);

// Event listeners for online and offline events
window.addEventListener('online', () => updateStatusMessage(true));
window.addEventListener('offline', () => updateStatusMessage(false));












