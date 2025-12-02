// Прогрес прокрутки у шапці

function updateProgress(): void {
    const bar: HTMLDivElement | null = document.querySelector("#scrollBar");
    if (!bar) return;

    const scrollTop: number = window.scrollY;
    const maxScroll: number =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const percent: number = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    bar.style.width = `${percent}%`;
}

export function initScrollBarUi(): void {
    window.addEventListener("scroll", updateProgress);
    updateProgress();
}
