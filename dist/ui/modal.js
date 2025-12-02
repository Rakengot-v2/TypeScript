// Модальне вікно "Зворотній зв'язок"
function changeModalState(open) {
    const modal = document.querySelector("#feedbackModal");
    const backdrop = document.querySelector("#backdrop");
    if (!modal || !backdrop) {
        console.warn("Modal або backdrop не знайдено.");
        return;
    }
    if (open) {
        modal.classList.add("modal--visible");
        backdrop.classList.add("backdrop--visible");
    }
    else {
        modal.classList.remove("modal--visible");
        backdrop.classList.remove("backdrop--visible");
    }
}
export function initModalUi() {
    const openButtons = document.querySelectorAll("[data-open-feedback]");
    const closeButtons = document.querySelectorAll("[data-close-feedback]");
    const backdrop = document.querySelector("#backdrop");
    openButtons.forEach((btn) => {
        btn.addEventListener("click", () => changeModalState(true));
    });
    closeButtons.forEach((btn) => {
        btn.addEventListener("click", () => changeModalState(false));
    });
    if (backdrop) {
        backdrop.addEventListener("click", () => changeModalState(false));
    }
}
