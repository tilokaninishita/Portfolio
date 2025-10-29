// js/script.js

// Global variables
let currentPage = 0;
let totalPages = 0;

// Check if device is mobile
function isMobile() {
    return window.innerWidth <= 480;
}

// Create mobile navigation if it doesn't exist
function createMobileNavigation() {
    if (!isMobile()) return;
    
    // Remove any existing mobile nav
    const existingMobileNav = document.querySelector('.mobile-nav');
    if (existingMobileNav) {
        existingMobileNav.remove();
    }
    
    // Create new mobile nav
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.innerHTML = `
        <span class="nextprev-btn back mobile-nav-btn" data-page="prev">
            <i class='bx bx-chevron-left'></i>
        </span>
        <span class="number-page mobile-page-indicator">1</span>
        <span class="nextprev-btn mobile-nav-btn" data-page="next">
            <i class='bx bx-chevron-right'></i>
        </span>
        <a href="#" class="back-profile mobile-back-btn">
            <i class='bx bxs-user'></i>
        </a>
    `;
    document.body.appendChild(mobileNav);
    
    // Force hide ALL original navigation elements
    const allOriginalNavElements = document.querySelectorAll(
        '.book-page .nextprev-btn, .book-page .number-page, .page-front .nextprev-btn, .page-back .nextprev-btn, .page-front .number-page, .page-back .number-page'
    );
    allOriginalNavElements.forEach(element => {
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        element.style.opacity = '0';
        element.style.pointerEvents = 'none';
    });
}

// Mobile page display function
function showPage(pageIndex) {
    const leftPage = document.querySelector('.book-page.page-left');
    const pages = document.querySelectorAll('.book-page.page-right');
    
    if (isMobile()) {
        // Hide all pages first
        leftPage.style.display = 'none';
        pages.forEach(page => {
            page.style.display = 'none';
            page.style.transform = 'translateX(0)';
        });
        
        // Show the current page
        if (pageIndex === 0) {
            // Show profile page
            leftPage.style.display = 'flex';
        } else {
            // Show the specific right page
            const targetPage = pages[pageIndex - 1];
            if (targetPage) {
                targetPage.style.display = 'flex';
            }
        }
    }
}

// Desktop page turning logic (original)
function handleDesktopPageTurn() {
    const pageTurnBtn = document.querySelectorAll('.nextprev-btn:not(.mobile-nav-btn)');
    
    pageTurnBtn.forEach((el, index) => {
        el.onclick = () => {
            const pageTurnId = el.getAttribute('data-page');
            const pageTurn = document.getElementById(pageTurnId);

            if (pageTurn && pageTurn.classList.contains('turn')) {
                pageTurn.classList.remove('turn');
                setTimeout(() => {
                    pageTurn.style.zIndex = 20 - index;
                }, 500);
            } else if (pageTurn) {
                pageTurn.classList.add('turn');
                setTimeout(() => {
                    pageTurn.style.zIndex = 20 + index;
                }, 500);
            }
        };
    });
}

// Mobile page turning logic
function handleMobilePageTurn() {
    const mobileNavBtns = document.querySelectorAll('.mobile-nav-btn');
    
    mobileNavBtns.forEach((el) => {
        el.onclick = (e) => {
            e.preventDefault();
            
            if (el.classList.contains('back') || el.getAttribute('data-page') === 'prev') {
                // Previous page
                if (currentPage > 0) {
                    currentPage--;
                    showPage(currentPage);
                }
            } else {
                // Next page
                if (currentPage < totalPages - 1) {
                    currentPage++;
                    showPage(currentPage);
                }
            }
            
            // Update button visibility
            updateNavigationButtons();
        };
    });
}

// Update navigation button visibility
function updateNavigationButtons() {
    if (isMobile()) {
        const prevBtn = document.querySelector('.mobile-nav-btn.back, .mobile-nav-btn[data-page="prev"]');
        const nextBtn = document.querySelector('.mobile-nav-btn:not(.back)');
        const pageIndicator = document.querySelector('.mobile-page-indicator');
        
        if (prevBtn) {
            prevBtn.style.opacity = currentPage === 0 ? '0.3' : '1';
            prevBtn.style.pointerEvents = currentPage === 0 ? 'none' : 'auto';
        }
        
        if (nextBtn) {
            nextBtn.style.opacity = currentPage === totalPages - 1 ? '0.3' : '1';
            nextBtn.style.pointerEvents = currentPage === totalPages - 1 ? 'none' : 'auto';
        }
        
        if (pageIndicator) {
            pageIndicator.textContent = currentPage + 1;
        }
    }
}

// Contact Me button functionality
function setupContactButton() {
    const contactMebtn = document.querySelector('.btn.contact-me');
    if (contactMebtn) {
        contactMebtn.onclick = (e) => {
            e.preventDefault();
            if (isMobile()) {
                // Go to last page (contact page)
                currentPage = totalPages - 1;
                showPage(currentPage);
                updateNavigationButtons();
            } else {
                // Original desktop functionality
                const pages = document.querySelectorAll('.book-page.page-right');
                pages.forEach((page, index) => {
                    setTimeout(() => {
                        page.classList.add('turn');
                        setTimeout(() => {
                            page.style.zIndex = 20 + index;
                        }, 500);
                    }, (index + 1) * 200 + 100);
                });
            }
        };
    }
}

// Back to Profile button functionality
function setupBackButton() {
    const backProfilebtn = document.querySelector('.back-profile');
    if (backProfilebtn) {
        backProfilebtn.onclick = (e) => {
            e.preventDefault();
            if (isMobile()) {
                // Go to first page (profile)
                currentPage = 0;
                showPage(currentPage);
                updateNavigationButtons();
            } else {
                // Original desktop functionality
                const pages = document.querySelectorAll('.book-page.page-right');
                let pageNumber = pages.length - 1;
                
                function reverseIndex() {
                    pageNumber--;
                    if (pageNumber < 0) {
                        pageNumber = pages.length - 1;
                    }
                }
                
                pages.forEach((_, index) => {
                    setTimeout(() => {
                        reverseIndex();
                        pages[pageNumber].classList.remove('turn');
                        setTimeout(() => {
                            pages[pageNumber].style.zIndex = 10 + index;
                        }, 500);
                    }, (index + 1) * 200 + 100);
                });
            }
        };
    }

    // Also handle mobile back button
    document.addEventListener('click', (e) => {
        if (e.target.closest('.mobile-back-btn')) {
            e.preventDefault();
            if (isMobile()) {
                currentPage = 0;
                showPage(currentPage);
                updateNavigationButtons();
            }
        }
    });
}

// Initialize desktop book animation
function initDesktopAnimation() {
    const coverRight = document.querySelector('.cover.cover-right');
    const pageLeft = document.querySelector('.book-page.page-left');
    const pages = document.querySelectorAll('.book-page.page-right');

    setTimeout(() => {
        if (coverRight) coverRight.classList.add('turn');
    }, 2100);

    setTimeout(() => {
        if (coverRight) coverRight.style.zIndex = -1;
    }, 2800);

    setTimeout(() => {
        if (pageLeft) pageLeft.style.zIndex = 20;
    }, 3200);

    // Original page reveal animation
    let pageNumber = pages.length - 1;
    
    function reverseIndex() {
        pageNumber--;
        if (pageNumber < 0) {
            pageNumber = pages.length - 1;
        }
    }

    pages.forEach((_, index) => {
        setTimeout(() => {
            reverseIndex();
            if (pages[pageNumber]) {
                pages[pageNumber].classList.remove('turn');
                setTimeout(() => {
                    pages[pageNumber].style.zIndex = 10 + index;
                }, 500);
            }
        }, (index + 1) * 200 + 2100);
    });
}

// Initialize on page load
function initializeBook() {
    const pages = document.querySelectorAll('.book-page.page-right');
    totalPages = pages.length + 1; // +1 for the left page (profile)
    
    if (isMobile()) {
        // Mobile initialization
        createMobileNavigation();
        showPage(0); // Start with profile page
        handleMobilePageTurn();
        updateNavigationButtons();
        
        // Hide mobile nav on desktop
        const mobileNav = document.querySelector('.mobile-nav');
        if (mobileNav) {
            mobileNav.style.display = 'block';
        }
    } else {
        // Desktop initialization (original)
        handleDesktopPageTurn();
        initDesktopAnimation();
        
        // Hide mobile nav on desktop
        const mobileNav = document.querySelector('.mobile-nav');
        if (mobileNav) {
            mobileNav.style.display = 'none';
        }
    }
    
    // Setup buttons for both mobile and desktop
    setupContactButton();
    setupBackButton();
}

// Handle window resize
function handleResize() {
    const wasMobile = document.body.classList.contains('mobile-view');
    const nowMobile = isMobile();
    
    if (wasMobile !== nowMobile) {
        if (nowMobile) {
            document.body.classList.add('mobile-view');
        } else {
            document.body.classList.remove('mobile-view');
        }
        initializeBook();
    }
}

// Add swipe functionality for mobile
let startX = 0;
let endX = 0;

function handleSwipe() {
    if (!isMobile()) return;
    
    const swipeThreshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next page
            if (currentPage < totalPages - 1) {
                currentPage++;
                showPage(currentPage);
                updateNavigationButtons();
            }
        } else {
            // Swipe right - previous page
            if (currentPage > 0) {
                currentPage--;
                showPage(currentPage);
                updateNavigationButtons();
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    currentPage = 0;
    
    if (isMobile()) {
        document.body.classList.add('mobile-view');
    }
    
    initializeBook();
});

// Handle window resize
window.addEventListener('resize', handleResize);

// Add touch event listeners for swipe
document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

document.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
});

// Prevent default touch behavior on navigation buttons
document.addEventListener('touchstart', (e) => {
    if (e.target.closest('.nextprev-btn') || e.target.closest('.back-profile')) {
        e.preventDefault();
    }
}, { passive: false });