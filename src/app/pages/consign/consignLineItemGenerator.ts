import {ConsignSaleLineItemsListResponse, GenderType, SizeType} from '../../../api';

const brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour', 'New Balance', 'Asics', 'Converse', 'Vans', 'Skechers'];
const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Grey', 'Purple', 'Orange', 'Pink'];
const sizes : SizeType[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const genders : GenderType[] = ['Male', 'Female'];
const conditions = ['New', 'Like New', 'Very Good', 'Good', 'Acceptable'];
const productTypes = ['T-Shirt', 'Jeans', 'Sneakers', 'Jacket', 'Dress', 'Skirt', 'Shorts', 'Sweater', 'Hoodie', 'Boots'];

function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function generateMockConsignLineItems(count: number): ConsignSaleLineItemsListResponse[] {
    return Array.from({ length: count }, (_, index) => ({
        consignSaleLineItemId: `CLI-${1000 + index}`,
        consignSaleId: 'CS-1000', // This would typically be passed in or generated
        dealPrice: Math.floor(Math.random() * 1000000) + 50000, // Random price between 50,000 and 1,050,000
        note: Math.random() > 0.7 ? 'Some note about the item' : null, // 30% chance of having a note
        confirmedPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 1000000) + 50000 : null, // 50% chance of having a confirmed price
        productName: `${getRandomElement(brands)} ${getRandomElement(productTypes)}`,
        brand: getRandomElement(brands),
        color: getRandomElement(colors),
        size: getRandomElement(sizes),
        gender: getRandomElement(genders),
        condition: getRandomElement(conditions),
        images: Math.random() > 0.5 ? [
            'https://example.com/image1.jpg',
            'https://example.com/image2.jpg'
        ] : null // 50% chance of having images
    }));
}

export function getMockConsignLineItems(): ConsignSaleLineItemsListResponse[] {
    const itemCount = Math.floor(Math.random() * 10) + 1; // Generate between 1 and 10 items
    return generateMockConsignLineItems(itemCount);
}