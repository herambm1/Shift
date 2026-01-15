// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Get form elements
    const searchForm = document.getElementById('searchForm');
    const swapBtn = document.getElementById('swapBtn');
    const fromLang = document.getElementById('fromLang');
    const toLang = document.getElementById('toLang');
    const userProfile = document.getElementById('userProfile');
    
    // Get navigation buttons
    const loginBtn = document.getElementById('loginBtn');
    const languageBtn = document.getElementById('languageBtn');
    const favoritesBtn = document.getElementById('favoritesBtn');
    
    // Get tabs (Transition button removed)
    const askAiTab = document.getElementById('askAiTab');
    const standaloneTab = document.getElementById('standaloneTab');
    
    // Swap languages function
    swapBtn.addEventListener('click', function() {
        const temp = fromLang.value;
        fromLang.value = toLang.value;
        toLang.value = temp;
        
        // Add animation feedback
        swapBtn.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            swapBtn.style.transform = 'rotate(0deg)';
        }, 300);
    });
    
    // Form submission handler
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            fromLanguage: fromLang.value,
            toLanguage: toLang.value,
            userProfile: userProfile.value
        };
        
        // Validation
        if (!formData.fromLanguage || !formData.toLanguage || !formData.userProfile) {
            alert('Please fill in all fields');
            return;
        }
        
        if (formData.fromLanguage === formData.toLanguage) {
            alert('Please select different languages');
            return;
        }
        
        console.log('Form submitted with data:', formData);
      window.location.href = `comparison.html?from=${formData.fromLanguage}&to=${formData.toLanguage}&concept=variables`;
    });
    
    // Login button handler
    loginBtn.addEventListener('click', function() {
        console.log('Login clicked');
        alert('Login functionality will be connected to backend');
    });
    
    // Language button handler
    languageBtn.addEventListener('click', function() {
        console.log('Language settings clicked');
        alert('Language settings will be implemented');
    });
    
    // Favorites button handler
    favoritesBtn.addEventListener('click', function() {
        console.log('Favorites clicked');
        alert('Favorites feature will be connected to backend');
    });
    
    // Tab navigation handlers
    const tabs = [askAiTab, standaloneTab];
    
    // Ask AI Tab - Opens AI chatbot
    askAiTab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        console.log('Ask AI clicked');
        alert('Opening AI Assistant...\n\nThis will connect to your AI chatbot for instant help!');
        // TODO: Open chatbot interface
    });
    
    // Standalone Tab - Coming Soon popup
    standaloneTab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        console.log('Study Stand-alone clicked');
        alert('Coming Soon! 🚀\n\nStand-alone learning mode will be available in the next update.');
    });
    
    // Prevent selecting the same language in both dropdowns
    fromLang.addEventListener('change', function() {
        if (this.value && this.value === toLang.value) {
            alert('Please select different languages');
            this.value = '';
        }
    });
    
    toLang.addEventListener('change', function() {
        if (this.value && this.value === fromLang.value) {
            alert('Please select different languages');
            this.value = '';
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            fromLang.focus();
        }
        
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            searchForm.dispatchEvent(new Event('submit'));
        }
    });
    
    console.log('Shift platform initialized successfully!');
});
