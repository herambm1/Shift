// API base URL
const API_URL = 'http://localhost:3000/api';

// Global state
let currentFromLang = 'java';
let currentToLang = 'python';
let currentMode = 'concept';
let currentItem = 'variables';

// Get URL parameters
function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        from: urlParams.get('from') || 'java',
        to: urlParams.get('to') || 'python',
        mode: urlParams.get('mode') || 'concept',
        item: urlParams.get('item') || 'variables'
    };
}

// DOM elements
const sourceLangName = document.getElementById('sourceLangName');
const targetLangName = document.getElementById('targetLangName');
const conceptTitle = document.getElementById('conceptTitle');
const sourceSyntax = document.getElementById('sourceSyntax');
const targetSyntax = document.getElementById('targetSyntax');
const sourceCode = document.getElementById('sourceCode');
const targetCode = document.getElementById('targetCode');
const sourceKeyPoints = document.getElementById('sourceKeyPoints');
const targetKeyPoints = document.getElementById('targetKeyPoints');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const params = getUrlParams();
    currentFromLang = params.from;
    currentToLang = params.to;
    currentMode = params.mode;
    currentItem = params.item;
    
    initNavigation();
    loadComparison();
    updateProgressTracker();
});

// Navigation
function initNavigation() {
    // Core concepts & programs
    document.querySelectorAll('.progress-item[data-mode]').forEach(item => {
        item.addEventListener('click', function() {
            const mode = this.dataset.mode;
            const itemName = this.dataset.item;
            navigate(mode, itemName);
        });
    });

    // Function dropdown
    const dropdownTrigger = document.querySelector('.dropdown-trigger');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const functionSection = document.querySelector('[data-mode="function"]');

    dropdownTrigger.addEventListener('click', function() {
        const dropdown = this.closest('.function-dropdown');
        dropdown.classList.toggle('open');
    });

    document.querySelectorAll('.menu-item[data-item]').forEach(item => {
        item.addEventListener('click', function() {
            const itemName = this.dataset.item;
            navigate('function', itemName);
            document.querySelector('.function-dropdown').classList.remove('open');
        });
    });

    // Path section switching (hover effect)
    document.querySelectorAll('.path-section').forEach(section => {
        section.addEventListener('mouseenter', function() {
            if (this.dataset.mode !== currentMode) {
                this.style.background = 'rgba(0, 217, 255, 0.1)';
            }
        });
        section.addEventListener('mouseleave', function() {
            if (this.dataset.mode !== currentMode) {
                this.style.background = '';
            }
        });
    });

    // Next button
    document.getElementById('nextTopicBtn').addEventListener('click', nextItem);
}

// Navigate to new content
function navigate(mode, item) {
    currentMode = mode;
    currentItem = item;
    updateUrl();
    loadComparison();
    updateProgressTracker();
}

// Update browser URL without reload
function updateUrl() {
    const params = new URLSearchParams({
        from: currentFromLang,
        to: currentToLang,
        mode: currentMode,
        item: currentItem
    });
    window.history.replaceState({}, '', `?${params}`);
}

// Next item logic
function nextItem() {
    const sequences = {
        concept: ['variables', 'functions', 'loops', 'conditionals', 'classes'],
        program: ['palindrome', 'count_vowels', 'reverse_string', 'sum_array', 'word_count']
    };
    
    const currentSeq = sequences[currentMode] || [];
    const currentIndex = currentSeq.indexOf(currentItem);
    const nextIndex = (currentIndex + 1) % currentSeq.length;
    const nextItem = currentSeq[nextIndex];
    
    navigate(currentMode, nextItem);
}

// Load comparison data
async function loadComparison() {
    try {
        const response = await fetch(`${API_URL}/compare?from=${currentFromLang}&to=${currentToLang}&mode=${currentMode}&item=${currentItem}`);
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        displayComparison(data);
        updateCurrentModeTitle(data);
        
    } catch (error) {
        console.error('Load error:', error);
        conceptTitle.textContent = 'Content not found';
    }
}

function displayComparison(data) {
    sourceLangName.textContent = capitalizeFirst(data.from_language);
    targetLangName.textContent = capitalizeFirst(data.to_language);
    conceptTitle.textContent = data.source.name || capitalizeFirst(data.item);
    
    sourceSyntax.textContent = data.source.syntax?.signature || 'N/A';
    targetSyntax.textContent = data.target.syntax?.signature || 'N/A';
    
    sourceCode.textContent = data.source.usage_snippet || data.source.code_example || 'No example';
    targetCode.textContent = data.target.usage_snippet || data.target.code_example || 'No example';
    
    sourceKeyPoints.innerHTML = '';
    (data.source.key_points || data.source.usage_notes || []).forEach(point => {
        const li = document.createElement('li');
        li.textContent = point;
        sourceKeyPoints.appendChild(li);
    });
    
    targetKeyPoints.innerHTML = '';
    (data.target.key_points || data.target.usage_notes || []).forEach(point => {
        const li = document.createElement('li');
        li.textContent = point;
        targetKeyPoints.appendChild(li);
    });
    
    document.title = `${capitalizeFirst(data.from_language)} to ${capitalizeFirst(data.to_language)} - ${data.source.name || capitalizeFirst(data.item)}`;
}

function updateCurrentModeTitle(data) {
    const titles = {
        concept: 'Core Concepts',
        function: 'Inbuilt Functions',
        program: 'Intro Programs'
    };
    document.getElementById('currentModeTitle').textContent = titles[currentMode] || 'Learning';
}

function updateProgressTracker() {
    // Update core concepts active state
    document.querySelectorAll('.progress-item[data-mode="concept"]').forEach((item, index) => {
        const concepts = ['variables', 'functions', 'loops', 'conditionals', 'classes'];
        if (currentMode === 'concept' && concepts[index] === currentItem) {
            item.classList.add('active');
            item.querySelector('.progress-icon').textContent = '►';
        } else {
            item.classList.remove('active');
            item.querySelector('.progress-icon').textContent = '□';
        }
    });

    // Update function dropdown active state
    document.querySelectorAll('.menu-item[data-item]').forEach(item => {
        item.classList.toggle('active', currentMode === 'function' && item.dataset.item === currentItem);
    });

    // Update programs active state
    document.querySelectorAll('.progress-item[data-mode="program"]').forEach((item, index) => {
        const programs = ['palindrome', 'count_vowels', 'reverse_string', 'sum_array', 'word_count'];
        if (currentMode === 'program' && programs[index] === currentItem) {
            item.classList.add('active');
            item.querySelector('.progress-icon').textContent = '►';
        } else {
            item.classList.remove('active');
            item.querySelector('.progress-icon').textContent = '★';
        }
    });

    // Show/hide path sections
    document.querySelectorAll('.path-section').forEach(section => {
        section.classList.toggle('active', section.dataset.mode === currentMode);
    });
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
