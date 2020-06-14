import { Controller, Get, Post, Body, Param, Delete, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductStatusValidationPipe } from './pipes/product-status-validation.pipe';
import { Product } from './product.entity';
import { ProductStatus } from './product-status.enum';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) {}

    @Get()
    getProducts(): Promise<Product[]> {
        return this.productsService.getProducts();
    }

    @Get('/:id')
    getProductById(@Param('id', ValidationPipe) id: string): Promise<Product> {
        return this.productsService.getProductById(id);
    }

    @Delete('/:id')
    deleteProduct(@Param('id', ValidationPipe) id: string): Promise<void>{
        return this.productsService.deleteProduct(id);
    }

    @Patch('/:id/status')
    updateProductStatus(@Param('id', ValidationPipe) id: string, @Body('status', ProductStatusValidationPipe) status: ProductStatus): Promise<Product>{
        return this.productsService.updateProductStatus(id, status);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createProduct(@Body() createProductDto: CreateProductDto): Promise<Product>{
        return this.productsService.createProduct(createProductDto);
    }
}
