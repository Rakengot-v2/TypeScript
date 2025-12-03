// ---- Крок 1: Базові типи ----
// ---- Крок 2: Функції пошуку та фільтрації ----
/**
 * findProduct:
 * шукає продукт за id в масиві продуктів.
 */
export const findProduct = (products, id) => {
    if (!Array.isArray(products) || products.length === 0) {
        return undefined;
    }
    if (!Number.isFinite(id)) {
        console.warn("findProduct: некоректний id");
        return undefined;
    }
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            return products[i];
        }
    }
    return undefined;
};
/**
 * filterByPrice:
 * повертає всі продукти, вартість яких <= maxPrice.
 */
export const filterByPrice = (products, maxPrice) => {
    if (!Array.isArray(products)) {
        console.warn("filterByPrice: products не є масивом");
        return [];
    }
    if (!Number.isFinite(maxPrice) || maxPrice < 0) {
        console.warn("filterByPrice: некоректна maxPrice");
        return [];
    }
    const result = [];
    for (let i = 0; i < products.length; i++) {
        const item = products[i];
        if (item.price <= maxPrice) {
            result.push(item);
        }
    }
    return result;
};
/**
 * addToCart:
 * додає товар у кошик або збільшує його кількість,
 * повертає новий масив без мутації оригінального.
 */
export const addToCart = (cart, product, quantity) => {
    if (!product || quantity <= 0) {
        console.warn("addToCart: некоректні дані");
        return cart;
    }
    const updatedCart = cart.map((item) => (Object.assign({}, item)));
    const index = updatedCart.findIndex((item) => item.product.id === product.id);
    if (index !== -1) {
        updatedCart[index].quantity += quantity;
    }
    else {
        updatedCart.push({
            product,
            quantity
        });
    }
    return updatedCart;
};
/**
 * calculateTotal:
 * обчислює загальну суму кошика з урахуванням кількості.
 */
export const calculateTotal = (cart) => {
    if (!Array.isArray(cart) || cart.length === 0) {
        return 0;
    }
    let sum = 0;
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        if (!item.product.inStock) {
            continue; // не враховуємо товари, яких немає в наявності
        }
        if (item.quantity > 0 && item.product.price >= 0) {
            sum += item.product.price * item.quantity;
        }
    }
    return sum;
};
// ---- Крок 4: Тестові дані ----
const phones = [
    {
        id: 1,
        name: "Смартфон Nova X",
        price: 15000,
        inStock: true,
        description: "Смартфон з AMOLED-екраном",
        category: "electronics",
        brand: "Nova",
        warrantyYears: 2,
        hasBluetooth: true
    },
    {
        id: 2,
        name: "Навушники AirBeat",
        price: 3200,
        inStock: true,
        description: "Бездротові навушники з шумопоглинанням",
        category: "electronics",
        brand: "BeatLab",
        warrantyYears: 1,
        hasBluetooth: true
    }
];
const clothes = [
    {
        id: 3,
        name: "Спортивні легінси",
        price: 1200,
        inStock: true,
        description: "Щільні легінси для тренувань",
        category: "clothing",
        size: "M",
        fabric: "Nylon",
        isSport: true
    },
    {
        id: 4,
        name: "Сорочка класична",
        price: 1100,
        inStock: false,
        description: "Біла сорочка для офісу",
        category: "clothing",
        size: "S",
        fabric: "Cotton",
        isSport: false
    }
];
const books = [
    {
        id: 5,
        name: "TypeScript у прикладах",
        price: 800,
        inStock: true,
        description: "Практичний посібник",
        category: "book",
        author: "Anna Dev",
        year: 2023,
        language: "uk"
    }
];
// ---- Приклади використання ----
const allProducts = [
    ...phones,
    ...clothes,
    ...books
];
const foundHeadphones = findProduct(phones, 2);
const cheapItems = filterByPrice(allProducts, 2000);
let mixedCart = [];
if (foundHeadphones) {
    mixedCart = addToCart(mixedCart, foundHeadphones, 1);
}
const leggings = findProduct(clothes, 3);
if (leggings) {
    mixedCart = addToCart(mixedCart, leggings, 2);
}
const tsBook = findProduct(books, 5);
if (tsBook) {
    mixedCart = addToCart(mixedCart, tsBook, 1);
}
const totalSum = calculateTotal(mixedCart);
// Для перевірки (перед здачею можна закоментувати)
console.log("Знайдені навушники:", foundHeadphones);
console.log("Товари до 2000:", cheapItems);
console.log("Кошик:", mixedCart);
console.log("Загальна сума:", totalSum);
