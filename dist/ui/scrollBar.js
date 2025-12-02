// Прогрес прокрутки у шапці
function updateProgress() {
    const bar = document.querySelector("#scrollBar");
    if (!bar)
        return;
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
    const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    bar.style.width = `${percent}%`;
}
export function initScrollBarUi() {
    window.addEventListener("scroll", updateProgress);
    updateProgress();
}
