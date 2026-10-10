// --- Navigation & Mobile Menu ---
const sidemenu = document.getElementById("sidemenu");

function openmenu() {
    sidemenu.style.right = "0";
}

function closemenu() {
    sidemenu.style.right = "-200px";
}

// --- Tab Functionality ---
const tablinks = document.getElementsByClassName("tab-links");
const tabcontents = document.getElementsByClassName("tab-contents");

function opentab(event, tabname) {
    for (let tablink of tablinks) {
        tablink.classList.remove("active-link");
    }
    for (let tabcontent of tabcontents) {
        tabcontent.classList.remove("active-tab");
    }
    event.currentTarget.classList.add("active-link");
    document.getElementById(tabname).classList.add("active-tab");
}

// --- Typing Effect ---
const words = ["AI Engineer", "Machine Learning Specialist", "LLM Developer", "RAG Systems Expert"];
let i = 0;
let timer;

function typingEffect() {
    let word = words[i].split("");
    var loopTyping = function() {
        if (word.length > 0) {
            document.getElementById('typing-text').innerHTML += word.shift();
        } else {
            setTimeout(deletingEffect, 2000);
            return false;
        }
        timer = setTimeout(loopTyping, 100);
    };
    loopTyping();
}

function deletingEffect() {
    let word = words[i].split("");
    var loopDeleting = function() {
        if (word.length > 0) {
            word.pop();
            document.getElementById('typing-text').innerHTML = word.join("");
        } else {
            if (words.length > (i + 1)) {
                i++;
            } else {
                i = 0;
            }
            typingEffect();
            return false;
        }
        timer = setTimeout(loopDeleting, 50);
    };
    loopDeleting();
}

// --- Intersection Observer for Scroll Animations ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // If you want it to trigger only once, uncomment the line below:
            // observer.unobserve(entry.target);
        } else {
            // Optional: Remove class when scrolled out of view to re-animate when scrolling back
            entry.target.classList.remove('in-view');
        }
    });
}, observerOptions);

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Start typing effect
    if(document.getElementById('typing-text')) {
        typingEffect();
    }

    // Select all elements to animate
    const animatedSections = document.querySelectorAll('.section-animate, .work, .services-list div, .about-col-1, .about-col-2, .contact-left, .contact-right');
    animatedSections.forEach(el => {
        el.classList.add('hidden-section');
        observer.observe(el);
    });
    
    // Add sticky nav background on scroll
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    });

    // Handle scroll offset for fixed header navigation
    document.querySelectorAll('nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
             if(href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                   targetElement.scrollIntoView({
                      behavior: 'smooth'
                   });
                   // close mobile menu if opened
                   closemenu();
                }
             }
        });
    });
});
