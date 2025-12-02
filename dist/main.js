import { initModalUi } from "./ui/modal.js";
import { initScrollBarUi } from "./ui/scrollBar.js";
import { initFeatureAnimation } from "./ui/featureAnimation.js";
import { initPostsData } from "./data/posts.js";
function initPage() {
    initModalUi();
    initScrollBarUi();
    initFeatureAnimation();
    initPostsData();
}
document.addEventListener("DOMContentLoaded", () => {
    initPage();
});
