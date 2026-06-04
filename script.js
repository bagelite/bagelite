// Luxury Perfume E-commerce - Script

// Pricing Rules
const pricing = {
    1: 180,
    2: 320,
    3: 420
};

// State Management
let cart = JSON.parse(localStorage.getItem('bag_elite_cart')) || [];

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    handleIntroAnimation();
    initNavigation();
    initProductPages();
    initParticles();
    
    if (document.getElementById('checkout-page')) {
        renderOrderSummary();
    }
});

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
    createViewCartBar();
    updateViewCartBar();
}

function createViewCartBar() {
    if (document.getElementById('view-cart-bar')) return;

    const bar = document.createElement('div');
    bar.id = 'view-cart-bar';
    bar.className = 'view-cart-bar';
    bar.innerHTML = `
        <span class="view-cart-bar-text"></span>
        <a href="checkout.html" class="btn-view-cart-bar">Voir le panier</a>
    `;
    document.body.appendChild(bar);
}

function updateViewCartBar() {
    const bar = document.getElementById('view-cart-bar');
    if (!bar) return;

    const count = cart.length;
    if (count === 0) {
        bar.classList.remove('visible');
        return;
    }

    const label = count === 1 ? '1 parfum sélectionné' : `${count} parfums sélectionnés`;
    bar.querySelector('.view-cart-bar-text').textContent = label;
    bar.classList.add('visible');
}

function showViewCartOnCard(btn) {
    const card = btn.closest('.product-card');
    if (!card) return;

    let link = card.querySelector('.btn-view-cart');
    if (!link) {
        link = document.createElement('a');
        link.href = 'checkout.html';
        link.className = 'btn-view-cart';
        link.textContent = 'Voir le panier';
        btn.insertAdjacentElement('afterend', link);
    }
    link.classList.add('visible');
}

// Cart Logic
function addToCartManual(btn) {
    if (cart.length >= 3) {
        alert("Vous pouvez choisir au maximum 3 parfums pour bénéficier de nos offres.");
        return;
    }

    const name = btn.dataset.name;
    const image = btn.dataset.image;

    cart.push({
        name: name,
        image: image,
        cartId: Date.now() + Math.random()
    });

    saveCart();
    showViewCartOnCard(btn);
    updateViewCartBar();
}

function saveCart() {
    localStorage.setItem('bag_elite_cart', JSON.stringify(cart));
}

// Pricing Calculation
function calculateTotal(items) {
    const totalItems = items.length;
    
    if (totalItems === 1) return pricing[1];
    if (totalItems === 2) return pricing[2];
    if (totalItems === 3) return pricing[3];
    
    return 0;
}

// Checkout Logic
function renderOrderSummary() {
    const summaryList = document.getElementById('summary-list');
    const totalProduits = document.getElementById('total-produits');
    const totalGeneral = document.getElementById('total-general');

    if (!summaryList) return;

    if (cart.length === 0) {
        summaryList.innerHTML = '<p style="color: #999;">Votre panier est vide.</p>';
        totalProduits.innerText = '0 DH';
        totalGeneral.innerText = '20 DH';
        return;
    }

    summaryList.innerHTML = cart.map((item, index) => `
        <div class="summary-item">
            <span>${item.name}</span>
            <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #ff4444; cursor: pointer; font-size: 12px;">Supprimer</button>
        </div>
    `).join('');

    const subtotal = calculateTotal(cart);
    totalProduits.innerText = `${subtotal} DH`;
    totalGeneral.innerText = `${subtotal + 20} DH`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateViewCartBar();
    renderOrderSummary();
}

// WhatsApp Order Confirmation
function confirmOrder() {
    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;
    const ville = document.getElementById('ville').value;
    const adresse = document.getElementById('adresse').value;
    const telephone = document.getElementById('telephone').value;

    if (!nom || !prenom || !ville || !adresse || !telephone) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    if (cart.length === 0) {
        alert("Votre panier est vide.");
        return;
    }

    const subtotal = calculateTotal(cart);
    const total = subtotal + 20;

    let message = `Bonjour,\n\nJe souhaite commander :\n\n`;
    
    // Group items for clear reading but show they are separate
    const counts = {};
    cart.forEach(item => {
        counts[item.name] = (counts[item.name] || 0) + 1;
    });
    
    for (const name in counts) {
        message += `- ${name} (x${counts[name]})\n`;
    }

    message += `\nTotal produits (${cart.length} parfums) : ${subtotal} DH`;
    message += `\nLivraison : 20 DH`;
    message += `\nTotal général : ${total} DH`;
    message += `\n\nInformations client :\n`;
    message += `Nom : ${nom}\n`;
    message += `Prénom : ${prenom}\n`;
    message += `Ville : ${ville}\n`;
    message += `Adresse : ${adresse}\n`;
    message += `Téléphone : ${telephone}\n`;
    message += `\nMerci.`;

    const whatsappUrl = `https://wa.me/212617981752?text=${encodeURIComponent(message)}`;
    
    // Clear cart after order
    cart = [];
    saveCart();
    
    window.open(whatsappUrl, '_blank');
}
