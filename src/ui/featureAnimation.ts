// Анімація карток "можливостей"

export function initFeatureAnimation(): void {
    const cards: NodeListOf<HTMLDivElement> =
        document.querySelectorAll(".feature-card.js-observe");
    if (cards.length === 0) return;

    const observer: IntersectionObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]): void => {
            entries.forEach((entry: IntersectionObserverEntry): void => {
                if (entry.isIntersecting) {
                    const element: Element = entry.target;
                    element.classList.add("feature-card--visible");
                    observer.unobserve(element);
                }
            });
        },
        { threshold: 0.25 }
    );

    cards.forEach((card: HTMLDivElement): void => {
        observer.observe(card);
    });
}
