import { Repository, EntityRepository } from "typeorm";
import { Product } from "./product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductStatus } from "./product-status.enum";
import { Logger, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(Product)
export class ProductRepository extends Repository<Product>{
    private logger = new Logger('ProductRepository');

    async getProducts(): Promise<Product[]>{
        try{
            const products = await this.find();
            return products;
        } catch(error){
            this.logger.error(`Failed to get products`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        const { title, description, price } = createProductDto;

        const product = new Product();
        product.title = title;
        product.description = description;
        product.status = ProductStatus.AVAILABLE;
        product.price = price;

        try{
            await product.save();
        }catch(error){
            this.logger.error(`Failed to create product. Data: ${createProductDto}`, error.stack);
            throw new InternalServerErrorException();
        }

        return product;
    }
}