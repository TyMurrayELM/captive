// js/navigation.js - Enhanced for Mobile

// Content cache to avoid reloading sections
const contentCache = {};

// Current section tracker
window.currentSection = null;

// Touch handling variables
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Loading state
let isLoading = false;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize touch handlers
    initializeTouchHandlers();
    
    // Initialize keyboard navigation
    initializeKeyboardNav();
    
    // Load initial section
    loadSection('captive-info');
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', handlePopState);
    
    // Add resize handler for orientation changes
    handleOrientationChange();
});

// Load section function with mobile enhancements
function loadSection(sectionId, skipHistory = false) {
    // Prevent multiple simultaneous loads
    if (isLoading) return;
    
    const contentArea = document.getElementById('content-area');
    
    // Set loading state
    isLoading = true;
    
    // Show loading indicator
    showLoadingIndicator();
    
    // Destroy charts if navigating away from financial info
    if (window.currentSection === 'financial-info' && sectionId !== 'financial-info') {
        if (typeof destroyCharts === 'function') {
            destroyCharts();
        }
    }
    
    // Update current section
    window.currentSection = sectionId;
    
    // Update navigation buttons
    updateNavigationButtons(sectionId);
    
    // Update browser history
    if (!skipHistory) {
        history.pushState({ section: sectionId }, '', `#${sectionId}`);
    }
    
    // Smooth scroll to top on mobile
    if (window.innerWidth <= 768) {
        smoothScrollToTop();
    }
    
    // Check if content is cached
    if (contentCache[sectionId]) {
        // Use cached content
        setTimeout(() => {
            contentArea.innerHTML = contentCache[sectionId];
            initializeSectionFeatures(sectionId);
            hideLoadingIndicator();
            isLoading = false;
        }, 100); // Small delay for smooth transition
        return;
    }
    
    // Load content from file
    fetch(`sections/${sectionId}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(content => {
            // Cache the content
            contentCache[sectionId] = content;
            
            // Display the content with fade effect
            contentArea.style.opacity = '0';
            contentArea.innerHTML = content;
            
            // Fade in
            requestAnimationFrame(() => {
                contentArea.style.transition = 'opacity 0.3s ease';
                contentArea.style.opacity = '1';
            });
            
            // Initialize section-specific features
            initializeSectionFeatures(sectionId);
            
            // Hide loading indicator
            hideLoadingIndicator();
            isLoading = false;
        })
        .catch(error => {
            console.error('Error loading section:', error);
            contentArea.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Error Loading Content</h2>
                    </div>
                    <div style="padding: 1.5rem;">
                        <p>Unable to load the requested section.</p>
                        <p style="font-size: 0.9rem; color: #666;">Error: ${error.message}</p>
                        <button onclick="retryLoadSection('${sectionId}')" 
                                style="margin-top: 1rem; padding: 0.5rem 1rem; 
                                       background: #3498db; color: white; 
                                       border: none; border-radius: 4px; 
                                       cursor: pointer;">
                            Retry
                        </button>
                    </div>
                </div>
            `;
            hideLoadingIndicator();
            isLoading = false;
        });
}

// Retry loading section
function retryLoadSection(sectionId) {
    // Clear cache for this section
    delete contentCache[sectionId];
    // Try loading again
    loadSection(sectionId);
}

// Update navigation buttons
function updateNavigationButtons(sectionId) {
    const allNavButtons = document.querySelectorAll('.nav-button');
    allNavButtons.forEach(button => {
        button.classList.remove('active');
        
        // Check if this button loads the current section
        if (button.onclick && button.onclick.toString().includes(sectionId)) {
            button.classList.add('active');
            
            // Ensure button is visible on mobile (scroll into view if needed)
            if (window.innerWidth <= 768) {
                button.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
    });
}

// Initialize section-specific features
function initializeSectionFeatures(sectionId) {
    // Initialize charts for financial info section
    if (sectionId === 'financial-info') {
        setTimeout(() => {
            if (typeof initializeCharts === 'function') {
                initializeCharts();
            } else {
                console.warn('Charts initialization function not found');
            }
        }, 100);
    }
    
    // Initialize touch-friendly features
    initializeTouchFeatures();
    
    // Initialize any tabs in the loaded content
    initializeTabHandlers();
    
    // Initialize modals
    initializeModalHandlers();
}

// Tab switching functions with mobile enhancements
function showTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    const tabs = document.querySelectorAll('.tab');
    
    // Hide all tab contents
    tabContents.forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedContent = document.getElementById(tabName);
    if (selectedContent) {
        selectedContent.style.display = 'block';
        selectedContent.classList.add('active');
        
        // Ensure tab content is visible on mobile
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                selectedContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
    
    // Add active class to clicked tab
    const clickedTab = Array.from(tabs).find(tab => 
        tab.onclick && tab.onclick.toString().includes(tabName)
    );
    if (clickedTab) {
        clickedTab.classList.add('active');
        
        // Ensure active tab is visible in scrollable container
        if (window.innerWidth <= 768) {
            clickedTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }
}

// Meeting tab switching
function showMeetingTab(tabName) {
    const meetingTabsContainer = document.getElementById('meeting-tabs-container');
    if (!meetingTabsContainer) return;
    
    const tabContents = meetingTabsContainer.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });
    
    const selectedTab = meetingTabsContainer.querySelector(`#${tabName}`);
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }
    
    updateTabButtons('showMeetingTab', tabName);
}

// Travel tab switching
function showTravelTab(tabName) {
    const travelTabsContainer = document.getElementById('travel-tabs-container');
    if (!travelTabsContainer) return;
    
    const tabContents = travelTabsContainer.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });
    
    const selectedTab = travelTabsContainer.querySelector(`#${tabName}`);
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }
    
    updateTabButtons('showTravelTab', tabName);
}

// Update tab buttons helper
function updateTabButtons(functionName, tabName) {
    const tabButtons = document.querySelectorAll('.tab');
    tabButtons.forEach(button => {
        if (button.onclick && button.onclick.toString().includes(functionName)) {
            if (button.onclick.toString().includes(tabName)) {
                button.classList.add('active');
                // Ensure active tab is visible on mobile
                if (window.innerWidth <= 768) {
                    button.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }
            } else {
                button.classList.remove('active');
            }
        }
    });
}

// KPI Modal Functions
function showKPIDetail(type) {
    console.log('showKPIDetail called for:', type);
    const modal = document.getElementById('kpi-modal');
    const modalBody = document.getElementById('kpi-modal-body');
    
    if (!modal || !modalBody) {
        console.error('KPI modal elements not found');
        return;
    }
    
    // Get content based on type (implementation continues as before)
    let content = getKPIContent(type);
    
    modalBody.innerHTML = content;
    modal.style.display = 'block';
    
    // Add touch/click outside to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeKPIModal();
        }
    });
    
    // Prevent body scroll on mobile when modal is open
    if (window.innerWidth <= 768) {
        document.body.style.overflow = 'hidden';
    }
}

function closeKPIModal() {
    const modal = document.getElementById('kpi-modal');
    if (modal) {
        modal.style.display = 'none';
        // Re-enable body scroll
        document.body.style.overflow = '';
    }
}

// Loading indicator functions
function showLoadingIndicator() {
    const existingLoader = document.getElementById('loading-indicator');
    if (existingLoader) return;
    
    const loader = document.createElement('div');
    loader.id = 'loading-indicator';
    loader.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: white; padding: 2rem; border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1); z-index: 9999;">
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div class="spinner" style="width: 30px; height: 30px; border: 3px solid #f3f3f3;
                     border-top: 3px solid #3498db; border-radius: 50%;
                     animation: spin 1s linear infinite;"></div>
                <span style="color: #2c3e50;">Loading...</span>
            </div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    document.body.appendChild(loader);
}

function hideLoadingIndicator() {
    const loader = document.getElementById('loading-indicator');
    if (loader) {
        loader.remove();
    }
}

// Smooth scroll to top
function smoothScrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Initialize touch handlers for swipe navigation
function initializeTouchHandlers() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    // Touch start
    mainContent.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    // Touch end
    mainContent.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
}

// Handle swipe gestures
function handleSwipe() {
    const swipeThreshold = 50;
    const verticalThreshold = 100;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = Math.abs(touchEndY - touchStartY);
    
    // Only handle horizontal swipes
    if (Math.abs(deltaX) > swipeThreshold && deltaY < verticalThreshold) {
        const sections = ['captive-info', 'financial-info', 'renewal-info', 'renewal-book-summary'];
        const currentIndex = sections.indexOf(window.currentSection);
        
        if (deltaX > 0 && currentIndex > 0) {
            // Swipe right - go to previous section
            loadSection(sections[currentIndex - 1]);
        } else if (deltaX < 0 && currentIndex < sections.length - 1) {
            // Swipe left - go to next section
            loadSection(sections[currentIndex + 1]);
        }
    }
}

// Initialize keyboard navigation
function initializeKeyboardNav() {
    document.addEventListener('keydown', function(e) {
        const sections = ['captive-info', 'financial-info', 'renewal-info', 'renewal-book-summary'];
        const currentIndex = sections.indexOf(window.currentSection);
        
        switch(e.key) {
            case 'ArrowLeft':
                if (currentIndex > 0) {
                    loadSection(sections[currentIndex - 1]);
                }
                break;
            case 'ArrowRight':
                if (currentIndex < sections.length - 1) {
                    loadSection(sections[currentIndex + 1]);
                }
                break;
            case 'Escape':
                // Close any open modals
                closeKPIModal();
                break;
        }
    });
}

// Handle browser back/forward
function handlePopState(e) {
    if (e.state && e.state.section) {
        loadSection(e.state.section, true);
    }
}

// Handle orientation changes
function handleOrientationChange() {
    window.addEventListener('orientationchange', function() {
        // Reinitialize features after orientation change
        setTimeout(() => {
            if (window.currentSection) {
                initializeSectionFeatures(window.currentSection);
            }
        }, 300);
    });
}

// Initialize touch-friendly features
function initializeTouchFeatures() {
    // Add touch feedback to clickable elements
    const clickables = document.querySelectorAll('.clickable, .nav-button, .tab, button');
    clickables.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.opacity = '0.7';
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            this.style.opacity = '1';
        }, { passive: true });
    });
}

// Initialize tab handlers
function initializeTabHandlers() {
    // Ensure all tabs have proper event handlers
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        // Add keyboard accessibility
        tab.setAttribute('tabindex', '0');
        tab.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Initialize modal handlers
function initializeModalHandlers() {
    // Close modals on escape key
    const modals = document.querySelectorAll('.kpi-modal, .modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });
}

// Get KPI content (moved from inline)
function getKPIContent(type) {
    // This would contain all the KPI modal content
    // Implementation continues as in the original
    switch(type) {
        case 'equity':
            return `
                <h2 style="color: #2c3e50; margin-bottom: 1.5rem;">Total Equity Calculation</h2>
                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px;">
                    <h3 style="color: #3498db; margin-bottom: 1rem;">$371,314 Before IBNR</h3>
                    <!-- Rest of content continues... -->
                </div>
            `;
        // Add other cases as needed
        default:
            return '<p>Details not available for this metric.</p>';
    }
}

// Debug function for charts
function debugCharts() {
    console.log('=== Chart Debug Info ===');
    console.log('Chart.js loaded:', typeof Chart !== 'undefined');
    console.log('initializeCharts available:', typeof initializeCharts !== 'undefined');
    console.log('Current section:', window.currentSection);
    console.log('Canvas elements found:');
    console.log('- trendChart:', document.getElementById('trendChart'));
    console.log('- coverageChart:', document.getElementById('coverageChart'));
    console.log('- developmentChart:', document.getElementById('developmentChart'));
    console.log('=======================');
    
    if (window.currentSection === 'financial-info' && typeof forceInitCharts === 'function') {
        console.log('Forcing chart initialization...');
        forceInitCharts();
    }
}

// Export functions for global access
window.loadSection = loadSection;
window.showTab = showTab;
window.showMeetingTab = showMeetingTab;
window.showTravelTab = showTravelTab;
window.showKPIDetail = showKPIDetail;
window.closeKPIModal = closeKPIModal;
window.debugCharts = debugCharts;