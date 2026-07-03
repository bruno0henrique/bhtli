(function () {
    'use strict';

    var year = document.getElementById('year');
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    var revealItems = document.querySelectorAll('.intro-section, .section-band, .project-card, .timeline li, .skill-group');
    revealItems.forEach(function (item) {
        item.classList.add('reveal');
    });

    if (!('IntersectionObserver' in window)) {
        revealItems.forEach(function (item) {
            item.classList.add('is-visible');
        });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach(function (item) {
        observer.observe(item);
    });
})();
