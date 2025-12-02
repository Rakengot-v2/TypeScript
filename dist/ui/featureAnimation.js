// Анімація карток "можливостей"
export function initFeatureAnimation() {
    const cards = document.querySelectorAll(".feature-card.js-observe");
    if (cards.length === 0)
        return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.classList.add("feature-card--visible");
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.25 });
    cards.forEach((card) => {
        observer.observe(card);
    });
}
