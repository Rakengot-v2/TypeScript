"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// --- Модальне вікно ---
function setFeedbackModal(open) {
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
function initFeedbackModal() {
    const openButtons = document.querySelectorAll("[data-open-feedback]");
    const closeButtons = document.querySelectorAll("[data-close-feedback]");
    const backdrop = document.querySelector("#backdrop");
    openButtons.forEach((btn) => {
        btn.addEventListener("click", () => setFeedbackModal(true));
    });
    closeButtons.forEach((btn) => {
        btn.addEventListener("click", () => setFeedbackModal(false));
    });
    if (backdrop) {
        backdrop.addEventListener("click", () => setFeedbackModal(false));
    }
}
// --- Прогрес прокрутки ---
function updateScrollBar() {
    const bar = document.querySelector("#scrollBar");
    if (!bar)
        return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${percent}%`;
}
function initScrollBar() {
    window.addEventListener("scroll", updateScrollBar);
    updateScrollBar();
}
// --- Анімація карток "можливостей" через IntersectionObserver ---
function initFeatureCardsAnimation() {
    const cards = document.querySelectorAll(".feature-card.js-observe");
    if (cards.length === 0)
        return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const target = entry.target;
                target.classList.add("feature-card--visible");
                observer.unobserve(target);
            }
        });
    }, {
        threshold: 0.2
    });
    cards.forEach((card) => {
        observer.observe(card);
    });
}
// --- Завантаження постів з API ---
let currentPage = 1;
const POSTS_PER_PAGE = 3;
function fetchPosts(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://jsonplaceholder.typicode.com/posts?_limit=${POSTS_PER_PAGE}&_page=${page}`;
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = yield response.json();
        return data;
    });
}
function createPostCard(post) {
    const card = document.createElement("div");
    card.className = "post-card";
    const title = document.createElement("h3");
    title.textContent = post.title;
    const body = document.createElement("p");
    body.textContent = post.body;
    card.appendChild(title);
    card.appendChild(body);
    return card;
}
function loadMorePosts() {
    return __awaiter(this, void 0, void 0, function* () {
        const container = document.querySelector("#postsContainer");
        const loadMoreBtn = document.querySelector("#loadMore");
        if (!container)
            return;
        try {
            const posts = yield fetchPosts(currentPage);
            if (posts.length === 0 && loadMoreBtn) {
                loadMoreBtn.disabled = true;
                loadMoreBtn.textContent = "Більше постів немає";
                return;
            }
            posts.forEach((post) => {
                const card = createPostCard(post);
                container.appendChild(card);
            });
            currentPage++;
        }
        catch (error) {
            console.error("Помилка завантаження постів:", error);
        }
    });
}
function initPostsSection() {
    const loadMoreBtn = document.querySelector("#loadMore");
    void loadMorePosts();
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
            void loadMorePosts();
        });
    }
}
// --- Ініціалізація всього додатку ---
function initApp() {
    initFeedbackModal();
    initScrollBar();
    initFeatureCardsAnimation();
    initPostsSection();
}
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});
