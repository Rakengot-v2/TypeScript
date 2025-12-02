// Модальне вікно "Зворотній зв'язок"

function changeModalState(open: boolean): void {
    const modal: HTMLDivElement | null = document.querySelector("#feedbackModal");
    const backdrop: HTMLDivElement | null = document.querySelector("#backdrop");

    if (!modal || !backdrop) {
        console.warn("Modal або backdrop не знайдено.");
        return;
    }

    if (open) {
        modal.classList.add("modal--visible");
        backdrop.classList.add("backdrop--visible");
    } else {
        modal.classList.remove("modal--visible");
        backdrop.classList.remove("backdrop--visible");
    }
}

export function initModalUi(): void {
    const openButtons: NodeListOf<HTMLButtonElement> =
        document.querySelectorAll("[data-open-feedback]");
    const closeButtons: NodeListOf<HTMLButtonElement> =
        document.querySelectorAll("[data-close-feedback]");
    const backdrop: HTMLDivElement | null = document.querySelector("#backdrop");

    openButtons.forEach((btn: HTMLButtonElement): void => {
        btn.addEventListener("click", (): void => changeModalState(true));
    });

    closeButtons.forEach((btn: HTMLButtonElement): void => {
        btn.addEventListener("click", (): void => changeModalState(false));
    });

    if (backdrop) {
        backdrop.addEventListener("click", (): void =>
            changeModalState(false)
        );
    }
}
