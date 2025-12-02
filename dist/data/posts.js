var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let currentPage = 1;
const LIMIT = 3;
function fetchPosts(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://jsonplaceholder.typicode.com/posts?_limit=${LIMIT}&_page=${page}`;
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error("Помилка HTTP: " + response.status);
        }
        const posts = yield response.json();
        return posts;
    });
}
function buildPostCard(post) {
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
export function loadNextPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        const container = document.querySelector("#postsContainer");
        const button = document.querySelector("#loadMore");
        if (!container)
            return;
        try {
            const posts = yield fetchPosts(currentPage);
            if (posts.length === 0 && button) {
                button.disabled = true;
                button.textContent = "Більше постів немає";
                return;
            }
            posts.forEach((post) => {
                const card = buildPostCard(post);
                container.appendChild(card);
            });
            currentPage++;
        }
        catch (error) {
            console.error("Не вдалося завантажити пости:", error);
        }
    });
}
export function initPostsData() {
    const button = document.querySelector("#loadMore");
    void loadNextPosts();
    if (button) {
        button.addEventListener("click", () => {
            void loadNextPosts();
        });
    }
}
