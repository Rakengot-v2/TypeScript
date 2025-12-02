import type { Post } from "../types/post.js";

let currentPage: number = 1;
const LIMIT: number = 3;

async function fetchPosts(page: number): Promise<Post[]> {
    const url: string = `https://jsonplaceholder.typicode.com/posts?_limit=${LIMIT}&_page=${page}`;
    const response: Response = await fetch(url);

    if (!response.ok) {
        throw new Error("Помилка HTTP: " + response.status);
    }

    const posts: Post[] = await response.json();
    return posts;
}

function buildPostCard(post: Post): HTMLDivElement {
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

export async function loadNextPosts(): Promise<void> {
    const container: HTMLDivElement | null =
        document.querySelector("#postsContainer");
    const button: HTMLButtonElement | null =
        document.querySelector("#loadMore");

    if (!container) return;

    try {
        const posts: Post[] = await fetchPosts(currentPage);
        if (posts.length === 0 && button) {
            button.disabled = true;
            button.textContent = "Більше постів немає";
            return;
        }

        posts.forEach((post: Post): void => {
            const card: HTMLDivElement = buildPostCard(post);
            container.appendChild(card);
        });

        currentPage++;
    } catch (error) {
        console.error("Не вдалося завантажити пости:", error);
    }
}

export function initPostsData(): void {
    const button: HTMLButtonElement | null =
        document.querySelector("#loadMore");

    void loadNextPosts();

    if (button) {
        button.addEventListener("click", (): void => {
            void loadNextPosts();
        });
    }
}
