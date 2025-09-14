import { products } from './data';
import { Product } from './types';

export const resolvers = {
  Query: {
    products: (): Product[] => {
      return products;
    },
    product: (_: any, { id }: { id: string }): Product | null => {
      return products.find(product => product.id === id) || null;
    }
  }
};