import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductRepository } from './product.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductStatus } from './product-status.enum';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductRepository)
        private productRepository: ProductRepository
    ) { }

    async getProducts(): Promise<Product[]> {
        return this.productRepository.getProducts();
    }

    async getProductById(id: string): Promise<Product> {
        try {
            const found = await this.productRepository.findOne(id);

            if (!found) {
                throw new NotFoundException(`Product with ID ${id} not found`);
            }

            return found;
        } catch (error) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
    }

    async deleteProduct(id: string): Promise<void> {
        try {
            const deleteResult = await this.productRepository.delete(id);

            if (deleteResult.affected === 0 || Object.keys(deleteResult).length === 0) {
                throw new NotFoundException(`Product with ID ${id} not found`);
            }
        } catch (error) {
            if(error.message.includes("not found")){
                throw new NotFoundException(`Product with ID ${id} not found`);
            }
        }
    }

    async updateProductStatus(id: string, status: ProductStatus): Promise<Product> {
        const product = await this.getProductById(id);
        product.status = status;
        await product.save();
        return product;
    }

    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        return this.productRepository.createProduct(createProductDto);
    }
}
