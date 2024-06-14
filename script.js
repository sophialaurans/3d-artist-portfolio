document.addEventListener('DOMContentLoaded', function() {
    // Define the image sequence in the carousel
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel img');
    const slideCount = slides.length;
    slides[currentSlide].classList.add('active');

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slideCount;
        slides[currentSlide].classList.add('active');
    }

    setInterval(nextSlide, 7000); // Show a new image every 7 seconds

    const line = document.querySelector('.line');
    
    const observerLine = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                line.style.width = '85vw'; // Expands the line to 85vw when it enters the viewport
            } else {
                line.style.width = '0'; // Shrinks the line when it's out of the viewport
            }
        });
    }, { threshold: [0, 1] });
    
    observerLine.observe(line);

    // Checks the position of the line relative to the bottom of the viewport
    window.addEventListener('scroll', () => {
        const rect = line.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        if (rect.bottom <= viewportHeight - 40) {
            line.style.width = '85vw'; // Expands the line to 85vw when the base is within 40px from the bottom of the viewport
        } else {
            line.style.width = '0'; // Shrinks the line when the base is outside the 40px range
        }
    });

    // Change the thumbnail image in the Projects section
    const works = document.querySelectorAll('.work');

    works.forEach((work, index) => {
        const thumbnails = work.querySelectorAll('.thumbnail');
        const mainImage = work.querySelector('.main-image img');
        const nextButton = work.querySelector('.next-button');
        const prevButton = work.querySelector('.prev-button');

        // Add event listener to each thumbnail
        thumbnails.forEach((thumbnail) => {
            thumbnail.addEventListener('click', () => {
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                thumbnail.classList.add('active'); // Remove active class from all thumbnails and add it to the clicked thumbnail
                const imageUrl = thumbnail.dataset.image;
                mainImage.src = imageUrl;
            });
        });

        // Add event listeners for next and previous buttons
        nextButton.addEventListener('click', () => changeImage(work, 'next'));
        prevButton.addEventListener('click', () => changeImage(work, 'prev'));

        // Function to change the main image based on direction (next or prev)
        function changeImage(work, direction) {
            const activeThumbnail = work.querySelector('.thumbnail.active');
            const thumbnails = Array.from(activeThumbnail.parentElement.children);
            const currentIndex = thumbnails.indexOf(activeThumbnail);
    
            let nextIndex;
            if (direction === 'next') {
                nextIndex = (currentIndex + 1) % thumbnails.length;
            } else {
                nextIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
            }
    
            // Update active classes for thumbnails
            thumbnails[currentIndex].classList.remove('active');
            thumbnails[nextIndex].classList.add('active');
            const imageUrl = thumbnails[nextIndex].dataset.image;
            mainImage.src = imageUrl; // Update the main image url
        }
    });
    
    // Calls the function to show the Gallery section initially
    show('gallery');

    // Calls the function when the screen size changes
    window.addEventListener('resize', () => {
        // Gets the active section (gallery or projects)
        const activeSection = document.getElementById('gallery').style.display === 'flex' ? 'gallery' : 'projects';
        // Shows the active section
        show(activeSection);
    });

    // Adds click event listeners to open the modal in the gallery section
    const galleryImages = document.querySelectorAll(".gallery-img-container img");
    galleryImages.forEach(img => {
        img.addEventListener("click", function() {
            openModalGallery(this);
        });
    });

    // Adds click event listeners to open the modal in the projects section
    const workElements = document.querySelectorAll(".work");
    workElements.forEach(work => {
        const mainImage = work.querySelector(".main-image img");
        mainImage.addEventListener("click", function() {
            openModalMainImage(work);
        });
    });

    // Smooth scroll for navbar links and header arrows
    $(".navbar a, .header-arrows a").click(function(event){
        event.preventDefault(); // Prevents the default link behavior
        const target = $(this).attr("href");
        $('html, body').animate({
            scrollTop: $(target).offset().top
        }, 1000); // 1 second scrolling time
    });
});

// Function that displays the specified section ('gallery' or 'projects') and adjusts the about section margin
function show(section) {
    const aboutSection = document.getElementById('about-section');
    const gallery = document.getElementById('gallery');
    const projects = document.getElementById('projects');
    const galleryButton = document.getElementById('gallery-switch-btn');
    const projectsButton = document.getElementById('projects-switch-btn');

    // Ensure both gallery and projects elements exist
    if (gallery && projects) {
        // Display the appropriate section and update button styles
        if (section === 'gallery') {
            gallery.style.display = 'flex';
            projects.style.display = 'none';
            galleryButton.style.color = 'white';
            projectsButton.style.color = '';
        } else if (section === 'projects') {
            gallery.style.display = 'none';
            projects.style.display = 'flex';
            projectsButton.style.color = 'white';
            galleryButton.style.color = '';
        }

        // Update about section margin based on the displayed section's height
        requestAnimationFrame(() => {
            let portfolioSectionHeight = section === 'gallery' ? gallery.offsetHeight : projects.offsetHeight;
            let aboutSectionHeight = aboutSection.offsetHeight;
            aboutSection.style.marginTop = `${portfolioSectionHeight}px`;
        });
    }
}

let currentImageIndex = 0;
let images = [];

// Function that opens a modal window for the gallery section, displaying the image bigger
function openModalGallery(imgElement) {
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("modalImg");
    const artstationLink = document.getElementById("artstationLink");

    // Display the modal and set the image src
    modal.style.display = "block";
    modalImg.src = imgElement.src;

    // Update the images array with all gallery images and set currentImageIndex to the clicked image
    images = Array.from(document.querySelectorAll(".gallery-img-container img")).map(img => ({
        src: img.src,
        link: img.getAttribute("data-link")
    }));
    currentImageIndex = images.findIndex(image => image.src === imgElement.src);

    // Set the ArtStation link and adjust its display based on availability
    const link = imgElement.getAttribute("data-link");
    artstationLink.href = link;
    artstationLink.style.display = link ? "inline-flex" : "none"; // Show link in gallery modal if it exists
}

// Function that opens a modal window for the projects section, displaying the image bigger
function openModalMainImage(parentWork) {
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("modalImg");
    const artstationLink = document.getElementById("artstationLink");

    // Display the modal and set the project's main image src
    modal.style.display = "block";
    const imgElement = parentWork.querySelector(".main-image img");
    modalImg.src = imgElement.src;

    // Set the ArtStation link from the main image and adjust display based on availability
    const link = imgElement.getAttribute("data-link");
    artstationLink.href = link;
    artstationLink.style.display = link ? "inline-flex" : "none"; // Show link in project modal if available

     // Update the images array with project thumbnails and set currentImageIndex to the clicked image
    const thumbnails = parentWork.querySelectorAll(".thumbnails .thumbnail");
    images = Array.from(thumbnails).map(thumbnail => ({
        src: thumbnail.getAttribute("data-image"),
        link: link // Use the same link for all thumbnails
    }));
    currentImageIndex = Array.from(thumbnails).findIndex(thumbnail => thumbnail.getAttribute("data-image") === imgElement.src);
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none"; // Hide the modal when called
}

// Listen for keydown events to navigate images with arrow keys
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowRight") {
        navigateImages(1);
    } else if (event.key === "ArrowLeft") {
        navigateImages(-1);
    }
});

// Function to navigate through images in the modal
function navigateImages(direction) {
    currentImageIndex += direction; // Update the current image index based on the direction

    // Ensure the index wraps around when reaching the end or beginning of the images array
    if (currentImageIndex < 0) {
        currentImageIndex = images.length - 1;
    } else if (currentImageIndex >= images.length) {
        currentImageIndex = 0;
    }

    // Update the modal image src and ArtStation link based on the new current image index
    const modalImg = document.getElementById("modalImg");
    modalImg.src = images[currentImageIndex].src; // Update the modal image src

    const artstationLink = document.getElementById("artstationLink");
    const link = images[currentImageIndex].link; // Update the ArtStation link
    artstationLink.href = link;
    artstationLink.style.display = link ? "inline-flex" : "none"; // Show or hide the link based on its availability
}