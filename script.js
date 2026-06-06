// Luxury Perfume E-commerce - Script

const PRODUCT_PRICE = 180;
const DELIVERY_PRICE = 20;

// State Management
let selectedProduct = JSON.parse(localStorage.getItem('bag_elite_order')) || null;

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    handleIntroAnimation();
    initNavigation();
    initAnnouncementBar();
    initProductPages();
    initParticles();
    
    if (document.getElementById('checkout-page')) {
        renderOrderSummary();
    }
});

// Scrolling announcement bar (Collection pages)
function initAnnouncementBar() {
    const track = document.querySelector('.announcement-track');
    if (!track) return;

    let position = 0;
    let segmentWidth = 0;

    const measure = () => {
        const segment = track.querySelector('.announcement-content');
        segmentWidth = segment ? segment.offsetWidth : 0;
    };

    measure();
    window.addEventListener('resize', measure);

    track.style.animation = 'none';

    const speed = window.innerWidth <= 768 ? 0.9 : 0.6;

    const tick = () => {
        position -= speed;
        if (segmentWidth > 0 && Math.abs(position) >= segmentWidth) {
            position += segmentWidth;
        }
        track.style.transform = `translate3d(${position}px, 0, 0)`;
        requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
}

// Premium Intro Logic
function handleIntroAnimation() {
    const overlay = document.getElementById('intro-overlay');
    const body = document.getElementById('main-body');
    
    // Check if intro has already played in this session
    const introPlayed = sessionStorage.getItem('intro_played');
    
    if (introPlayed || !overlay) {
        if (overlay) overlay.style.display = 'none';
        if (body) body.classList.remove('intro-active');
        return;
    }

    // Animation Sequence
    setTimeout(() => {
        overlay.classList.add('open'); // Open doors
    }, 1000);

    setTimeout(() => {
        overlay.classList.add('fade-out'); // Fade out overlay
        body.classList.remove('intro-active'); // Enable scrolling
        sessionStorage.setItem('intro_played', 'true'); // Save state
    }, 3500);
}

// Navigation & Header Effects
function initNavigation() {
    const header = document.getElementById('header');
    const heroBg = document.getElementById('hero-bg');
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    // Scroll Header Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Parallax Effect for Hero
        if (heroBg) {
            let offset = window.scrollY;
            heroBg.style.transform = `scale(1.1) translateY(${offset * 0.4}px)`;
        }

        // Active Section Indicator
        updateActiveLink();
    });

    // Mobile Menu Toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    nav.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });
}

function updateActiveLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Particle Effect
function initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const delay = Math.random() * 20;
        const duration = Math.random() * 10 + 10;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.bottom = `-10px`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;

        container.appendChild(particle);
    }
}

// Product pages (homme / femme)
function initProductPages() {
    if (!document.getElementById('product-grid')) return;
}

// Direct buy — one perfume per order
function addToCartManual(btn) {
    selectedProduct = {
        name: btn.dataset.name,
        image: btn.dataset.image,
        price: PRODUCT_PRICE
    };

    saveOrder();
    window.location.href = 'checkout.html';
}

function saveOrder() {
    localStorage.setItem('bag_elite_order', JSON.stringify(selectedProduct));
}

// Checkout Logic
function renderOrderSummary() {
    const preview = document.getElementById('checkout-product-preview');
    const summaryList = document.getElementById('summary-list');
    const totalProduits = document.getElementById('total-produits');
    const totalGeneral = document.getElementById('total-general');

    if (!summaryList) return;

    if (!selectedProduct) {
        if (preview) {
            preview.innerHTML = `
                <p class="checkout-empty">Aucun parfum sélectionné.</p>
                <a href="index.html#categories" class="btn-back-shop">Retour aux collections</a>
            `;
        }
        summaryList.innerHTML = '<p style="color: #999;">Aucun parfum sélectionné.</p>';
        totalProduits.innerText = '0 DH';
        totalGeneral.innerText = `${DELIVERY_PRICE} DH`;
        return;
    }

    if (preview) {
        preview.innerHTML = `
            <div class="checkout-product-card">
                <img src="${selectedProduct.image}" alt="${selectedProduct.name}" class="checkout-product-img">
                <div class="checkout-product-info">
                    <h3>${selectedProduct.name}</h3>
                    <p class="checkout-product-price">${selectedProduct.price} DH</p>
                </div>
            </div>
        `;
    }

    summaryList.innerHTML = `
        <div class="summary-item">
            <span>${selectedProduct.name}</span>
            <span>${selectedProduct.price} DH</span>
        </div>
    `;

    totalProduits.innerText = `${selectedProduct.price} DH`;
    totalGeneral.innerText = `${selectedProduct.price + DELIVERY_PRICE} DH`;
}

// Order Submission Logic (Google Sheets JSON)
function confirmOrder() {
    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;
    const ville = document.getElementById('ville').value;
    const adresse = document.getElementById('adresse').value;
    const telephone = document.getElementById('telephone').value;
    const btn = document.querySelector('.btn-confirm');

    if (!nom || !prenom || !ville || !adresse || !telephone) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    if (!selectedProduct) {
        alert("Aucun parfum sélectionné.");
        return;
    }

    // Prepare data as JSON object for Google Apps Script
    const orderData = {
        parfum: selectedProduct.name,
        prenom: prenom,
        nom: nom,
        ville: ville,
        adresse: adresse,
        numero: telephone
    };

    // Disable button and show loading state
    btn.innerText = "Traitement en cours...";
    btn.disabled = true;
    btn.style.opacity = "0.7";

    const scriptURL = 'https://script.google.com/macros/s/AKfycbxAT4Amj50nbXAqKrJgaEtPQIxixuGqNxq27hW54CUsHj4yyceu3dcV3S2XI-gXX2CBDg/exec';

    // Sending data as JSON string with proper headers
    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors', // Keeps the request simple to avoid preflight issues with Google
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(() => {
        // Clear order after successful submission
        selectedProduct = null;
        localStorage.removeItem('bag_elite_order');
        
        // Redirect to Thank You page
        window.location.href = 'thankyou.html';
    })
    .catch(error => {
        console.error('Error!', error.message);
        // Fallback redirection even if error occurs, as no-cors often triggers catch
        window.location.href = 'thankyou.html';
    });
}
