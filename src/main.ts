// --- Тип для постів з JSONPlaceholder ---
type Post = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

// --- Модальне вікно ---

function setFeedbackModal(open: boolean): void {
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

function initFeedbackModal(): void {
    const openButtons: NodeListOf<HTMLButtonElement> =
        document.querySelectorAll("[data-open-feedback]");
    const closeButtons: NodeListOf<HTMLButtonElement> =
        document.querySelectorAll("[data-close-feedback]");
    const backdrop: HTMLDivElement | null = document.querySelector("#backdrop");

    openButtons.forEach((btn: HTMLButtonElement): void => {
        btn.addEventListener("click", (): void => setFeedbackModal(true));
    });

    closeButtons.forEach((btn: HTMLButtonElement): void => {
        btn.addEventListener("click", (): void => setFeedbackModal(false));
    });

    if (backdrop) {
        backdrop.addEventListener("click", (): void => setFeedbackModal(false));
    }
}

// --- Прогрес прокрутки ---

function updateScrollBar(): void {
    const bar: HTMLDivElement | null = document.querySelector("#scrollBar");
    if (!bar) return;

    const scrollTop: number = window.scrollY;
    const docHeight: number =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const percent: number = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    bar.style.width = `${percent}%`;
}

function initScrollBar(): void {
    window.addEventListener("scroll", updateScrollBar);
    updateScrollBar();
}

// --- Анімація карток "можливостей" через IntersectionObserver ---

function initFeatureCardsAnimation(): void {
    const cards: NodeListOf<HTMLDivElement> =
        document.querySelectorAll(".feature-card.js-observe");

    if (cards.length === 0) return;

    const observer: IntersectionObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]): void => {
            entries.forEach((entry: IntersectionObserverEntry): void => {
                if (entry.isIntersecting) {
                    const target: Element = entry.target;
                    target.classList.add("feature-card--visible");
                    observer.unobserve(target);
                }
            });
        },
        {
            threshold: 0.2
        }
    );

    cards.forEach((card: HTMLDivElement): void => {
        observer.observe(card);
    });
}

// --- Завантаження постів з API ---

let currentPage: number = 1;
const POSTS_PER_PAGE: number = 3;

async function fetchPosts(page: number): Promise<Post[]> {
    const url: string = `https://jsonplaceholder.typicode.com/posts?_limit=${POSTS_PER_PAGE}&_page=${page}`;
    const response: Response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const data: Post[] = await response.json();
    return data;
}

function createPostCard(post: Post): HTMLDivElement {
    const card: HTMLDivElement = document.createElement("div");
    card.className = "post-card";

    const title: HTMLHeadingElement = document.createElement("h3");
    title.textContent = post.title;

    const body: HTMLParagraphElement = document.createElement("p");
    body.textContent = post.body;

    card.appendChild(title);
    card.appendChild(body);
    return card;
}

async function loadMorePosts(): Promise<void> {
    const container: HTMLDivElement | null =
        document.querySelector("#postsContainer");
    const loadMoreBtn: HTMLButtonElement | null =
        document.querySelector("#loadMore");

    if (!container) return;

    try {
        const posts: Post[] = await fetchPosts(currentPage);
        if (posts.length === 0 && loadMoreBtn) {
            loadMoreBtn.disabled = true;
            loadMoreBtn.textContent = "Більше постів немає";
            return;
        }

        posts.forEach((post: Post): void => {
            const card: HTMLDivElement = createPostCard(post);
            container.appendChild(card);
        });

        currentPage++;
    } catch (error) {
        console.error("Помилка завантаження постів:", error);
    }
}

function initPostsSection(): void {
    const loadMoreBtn: HTMLButtonElement | null =
        document.querySelector("#loadMore");

    void loadMorePosts();

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", (): void => {
            void loadMorePosts();
        });
    }
}

// --- Ініціалізація всього додатку ---

function initApp(): void {
    initFeedbackModal();
    initScrollBar();
    initFeatureCardsAnimation();
    initPostsSection();
}

document.addEventListener("DOMContentLoaded", (): void => {
    initApp();
});
