import { ProductStatus } from "../product-status.enum";
import { IsOptional, IsIn, IsNotEmpty } from "class-validator";

export class GetProductFilterDto{
    @IsOptional()
    @IsIn([ProductStatus.AVAILABLE, ProductStatus.IN_PROGRESS, ProductStatus.OUT_OF_STOCK])
    status: ProductStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}