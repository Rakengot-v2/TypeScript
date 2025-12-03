// ---- Крок 1: Базові типи ----

export type BaseProduct = {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
    description?: string;
};

export type Electronics = BaseProduct & {
    category: "electronics";
    brand: string;
    warrantyYears: number;
    hasBluetooth: boolean;
};

export type Clothing = BaseProduct & {
    category: "clothing";
    size: "XS" | "S" | "M" | "L" | "XL";
    fabric: string;
    isSport: boolean;
};

export type Book = BaseProduct & {
    category: "book";
    author: string;
    year: number;
    language: string;
};

// ---- Крок 2: Функції пошуку та фільтрації ----

/**
 * findProduct:
 * шукає продукт за id в масиві продуктів.
 */
export const findProduct = <T extends BaseProduct>(
    products: T[],
    id: number
): T | undefined => {
    if (!Array.isArray(products) || products.length === 0) {
        return undefined;
    }
    if (!Number.isFinite(id)) {
        console.warn("findProduct: некоректний id");
        return undefined;
    }

    for (let i: number = 0; i < products.length; i++) {
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
export const filterByPrice = <T extends BaseProduct>(
    products: T[],
    maxPrice: number
): T[] => {
    if (!Array.isArray(products)) {
        console.warn("filterByPrice: products не є масивом");
        return [];
    }

    if (!Number.isFinite(maxPrice) || maxPrice < 0) {
        console.warn("filterByPrice: некоректна maxPrice");
        return [];
    }

    const result: T[] = [];
    for (let i: number = 0; i < products.length; i++) {
        const item: T = products[i];
        if (item.price <= maxPrice) {
            result.push(item);
        }
    }
    return result;
};

// ---- Крок 3: Кошик ----

export type CartItem<T> = {
    product: T;
    quantity: number;
};

/**
 * addToCart:
 * додає товар у кошик або збільшує його кількість,
 * повертає новий масив без мутації оригінального.
 */
export const addToCart = <T extends BaseProduct>(
    cart: CartItem<T>[],
    product: T,
    quantity: number
): CartItem<T>[] => {
    if (!product || quantity <= 0) {
        console.warn("addToCart: некоректні дані");
        return cart;
    }

    const updatedCart: CartItem<T>[] = cart.map(
        (item: CartItem<T>): CartItem<T> => ({ ...item })
    );

    const index: number = updatedCart.findIndex(
        (item: CartItem<T>): boolean => item.product.id === product.id
    );

    if (index !== -1) {
        updatedCart[index].quantity += quantity;
    } else {
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
export const calculateTotal = <T extends BaseProduct>(
    cart: CartItem<T>[]
): number => {
    if (!Array.isArray(cart) || cart.length === 0) {
        return 0;
    }

    let sum: number = 0;

    for (let i: number = 0; i < cart.length; i++) {
        const item: CartItem<T> = cart[i];
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

const phones: Electronics[] = [
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

const clothes: Clothing[] = [
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

const books: Book[] = [
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

const allProducts: (Electronics | Clothing | Book)[] = [
    ...phones,
    ...clothes,
    ...books
];

const foundHeadphones: Electronics | undefined = findProduct<Electronics>(
    phones,
    2
);

const cheapItems: (Electronics | Clothing | Book)[] = filterByPrice<
    Electronics | Clothing | Book
>(allProducts, 2000);

let mixedCart: CartItem<Electronics | Clothing | Book>[] = [];

if (foundHeadphones) {
    mixedCart = addToCart(mixedCart, foundHeadphones, 1);
}

const leggings: Clothing | undefined = findProduct<Clothing>(clothes, 3);
if (leggings) {
    mixedCart = addToCart(mixedCart, leggings, 2);
}

const tsBook: Book | undefined = findProduct<Book>(books, 5);
if (tsBook) {
    mixedCart = addToCart(mixedCart, tsBook, 1);
}

const totalSum: number = calculateTotal(mixedCart);

// Для перевірки
console.log("Знайдені навушники:", foundHeadphones);
console.log("Товари до 2000:", cheapItems);
console.log("Кошик:", mixedCart);
console.log("Загальна сума:", totalSum);
