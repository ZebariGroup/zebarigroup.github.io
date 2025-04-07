document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (nav && nav.classList.contains('active') && !event.target.closest('nav') && !event.target.closest('.mobile-menu-btn')) {
            nav.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    if (nav && nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                    
                    // Scroll to target element
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Client-side form handling
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !message) {
                alert('Please fill out all required fields.');
                return;
            }
            
            // Email validation pattern
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Show success message
            const formElements = contactForm.elements;
            for (let i = 0; i < formElements.length; i++) {
                formElements[i].disabled = true;
            }
            
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.innerHTML = `
                <h3>Thank you for your message!</h3>
                <p>This is a demonstration form. To actually contact us, please email 
                <a href="mailto:matthew@zebarigroup.com">matthew@zebarigroup.com</a> directly.</p>
                <button type="button" class="btn btn-secondary" id="reset-form">Reset Form</button>
            `;
            
            contactForm.appendChild(successMessage);
            
            // Reset form functionality
            document.getElementById('reset-form').addEventListener('click', function() {
                contactForm.reset();
                for (let i = 0; i < formElements.length; i++) {
                    formElements[i].disabled = false;
                }
                successMessage.remove();
            });
        });
    }
    
    // Project template functionality (if on projects page)
    const projectTemplate = document.getElementById('project-template');
    const projectsContainer = document.getElementById('projects-container');
    
    if (projectTemplate && projectsContainer) {
        // Example function to add a new project
        // This would typically be called from an admin interface or CMS
        window.addNewProject = function(projectData) {
            const templateContent = projectTemplate.content.cloneNode(true);
            
            // Fill in project data
            const projectCard = templateContent.querySelector('.project-card');
            const projectSvg = projectCard.querySelector('.project-svg');
            const projectTitle = projectCard.querySelector('h3');
            const projectDescription = projectCard.querySelector('p');
            const projectTechnologies = projectCard.querySelector('.project-detail:nth-child(1) .detail-value');
            const projectIndustry = projectCard.querySelector('.project-detail:nth-child(2) .detail-value');
            const projectLink = projectCard.querySelector('a.btn');
            
            // Set project data
            projectTitle.textContent = projectData.title;
            projectDescription.textContent = projectData.description;
            projectTechnologies.textContent = projectData.technologies;
            projectIndustry.textContent = projectData.industry;
            projectLink.href = projectData.link;
            
            // Customize SVG if provided
            if (projectData.svgCustomizer && typeof projectData.svgCustomizer === 'function') {
                projectData.svgCustomizer(projectSvg);
            }
            
            // Add to projects container
            projectsContainer.appendChild(projectCard);
        };
        
        // Example usage (commented out):
        /*
        addNewProject({
            title: 'New Project Title',
            description: 'Description of the new project goes here.',
            technologies: 'PHP, JavaScript, HTML, CSS',
            industry: 'Healthcare, Manufacturing',
            link: 'https://example.com/project',
            svgCustomizer: function(svg) {
                // Add custom SVG elements
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', '200');
                circle.setAttribute('cy', '150');
                circle.setAttribute('r', '50');
                circle.setAttribute('fill', '#00a67e');
                svg.appendChild(circle);
            }
        });
        */
    }
});
