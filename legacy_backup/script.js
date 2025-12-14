// Sample data for your portfolio projects
const portfolioProjects = [
    {
        title: "Project 1:Braight Brains",
        image: "./img/project 1.png"
    },
    {
        title: "Project 2:Kadaikutty",
        image: "./img/project 3.png " 
    },
    {
        title: "Project 3:uptade version ",
        image: "./img/project 2.jpg "
    },
    {
        title: "Project 4: Element Explorer",
        image: ""
    }
];

// Function to dynamically create portfolio items
function displayProjects() {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (!portfolioGrid) return;

    portfolioProjects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('portfolio-item');
        
        projectDiv.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <h3>${project.title}</h3>
        `;
        
        portfolioGrid.appendChild(projectDiv);
    });
}

// Function to handle contact form submission
function handleFormSubmission(event) {
    event.preventDefault(); 
    
    const form = event.target;
    const name = form.querySelector('#name').value;
    const email = form.querySelector('#email').value;
    const message = form.querySelector('#message').value;
    
    console.log(`Contact form submitted!\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
    
    alert('Thank you for your message! I will get back to you shortly.');
    
    form.reset();
}

// NEW: Function to animate the skill circles
// function animateSkills() {
//     const skillCircles = document.querySelectorAll('.progress-circle');

//     const observer = new IntersectionObserver((entries, observer) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 const circle = entry.target;
//                 const percentage = parseInt(circle.getAttribute('data-percentage'));
//                 const angle = (percentage / 100) * 360;
                
//                 let currentAngle = 0;
//                 const innerPercentage = circle.querySelector('.percentage');

//                 const animate = () => {
//                     if (currentAngle < angle) {
//                         currentAngle += 2; // Adjust speed
//                         if (currentAngle > angle) currentAngle = angle;
//                         const currentPercentage = Math.round((currentAngle / 360) * 100);
//                         circle.style.setProperty('--gradient-angle', `${currentAngle}deg`);
//                         innerPercentage.textContent = `${currentPercentage}%`;
//                         requestAnimationFrame(animate);
//                     }
//                 };
                
//                 animate();
//                 observer.unobserve(circle); // Stop observing after animation
//             }
//         });
//     }, {
//         threshold: 0.5 // Trigger when 50% of the element is visible
//     });

//     skillCircles.forEach(circle => {
//         observer.observe(circle);
//     });
// }

// Run functions after the page loads
document.addEventListener('DOMContentLoaded', () => {
    displayProjects();
    
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
    }

    // New JavaScript for the hamburger menu
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Dynamic Background Scroll Effect

    // Note: Pseudo-elements are not directly accessible via JS DOM. 
    // Instead, we will manipulate CSS variables or the container itself.
    const bgContainer = document.getElementById('dynamic-bg');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const rotate = scrollY / 10; // Rotation based on scroll
        // Shift slightly
        const moveX = scrollY / 20;
        
        // We can manipulate the background definition directly or a child element.
        // Let's change the background gradient angle of the container slightly
        if (bgContainer) { // Ensure bgContainer exists before manipulating
            bgContainer.style.background = `linear-gradient(${120 + rotate}deg, #fdfbfb 0%, #ebedee 100%)`;
        }
        
        // Also shift hue of the entire page content slightly for a vibe? No, that's too much.
        // Let's just rotate the subtle gradient.
    });

    // Trigger skill animations
});