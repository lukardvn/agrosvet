import { mockCategories, mockProducts } from '../mocks/adminData';
import { Category, CategoryInput, Product, ProductSaveInput } from '../types';

let categories = mockCategories.map(category => ({ ...category }));
let products = mockProducts.map(product => ({ ...product }));

const nextId = (records: Array<{ id: number }>) =>
  records.reduce((highestId, record) => Math.max(highestId, record.id), 0) + 1;

const fileToDataUrl = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(new Error('Fotografija nije mogla da se učita.'));
  reader.readAsDataURL(file);
});

const resolveProductInput = async (input: ProductSaveInput) => {
  const { imageFile, imageUrl = '', ...productInput } = input;
  return {
    ...productInput,
    imageUrl: imageFile ? await fileToDataUrl(imageFile) : imageUrl,
  };
};

export const adminApi = {
  async getProducts(): Promise<Product[]> {
    return products.map(product => ({ ...product }));
  },

  async getProduct(id: number): Promise<Product | null> {
    const product = products.find(item => item.id === id);
    return product ? { ...product } : null;
  },

  async createProduct(input: ProductSaveInput): Promise<Product> {
    const product = { ...await resolveProductInput(input), id: nextId(products) };
    products = [...products, product];
    return { ...product };
  },

  async updateProduct(id: number, input: ProductSaveInput): Promise<Product> {
    const currentProduct = products.find(product => product.id === id);
    if (!currentProduct) throw new Error('Proizvod nije pronađen.');

    const product = { ...await resolveProductInput(input), id };
    products = products.map(item => item.id === id ? product : item);
    return { ...product };
  },

  async getCategories(): Promise<Category[]> {
    return categories.map(category => ({ ...category }));
  },

  async getCategory(id: number): Promise<Category | null> {
    const category = categories.find(item => item.id === id);
    return category ? { ...category } : null;
  },

  async createCategory(input: CategoryInput): Promise<Category> {
    const category = { ...input, id: nextId(categories) };
    categories = [...categories, category];
    return { ...category };
  },

  async updateCategory(id: number, input: CategoryInput): Promise<Category> {
    const currentCategory = categories.find(category => category.id === id);
    if (!currentCategory) throw new Error('Kategorija nije pronađena.');

    const category = { ...input, id };
    categories = categories.map(item => item.id === id ? category : item);
    return { ...category };
  },
};
