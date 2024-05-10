import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      return await this.productRepository.find({
        skip: paginationDto.offset,
        take: paginationDto.limit,
      });
    } catch (error) {
      this.handleException(error);
    }
  }

  async findOne(id: string) {
    try {
      let product: Product;

      if (isUUID(id)) {
        product = await this.productRepository.findOneBy({ id });
      } else {
        const queryBuilder =
          this.productRepository.createQueryBuilder('product');

        product = await queryBuilder
          .where('product.slug = :slug or LOWER(product.name) = :name', {
            slug: id.toLowerCase(),
            name: id.toLowerCase(),
          })
          .getOne();
      }

      if (!product) {
        throw new NotFoundException(`Product ${id} not found`);
      }

      return product;
    } catch (error) {
      this.handleException(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);
      await this.productRepository.remove(product);
      return product;
    } catch (error) {
      this.handleException(error);
    }
  }

  private handleException(error: any) {
    this.logger.error(error.message);

    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    if (error instanceof NotFoundException) {
      throw new NotFoundException(error.message);
    }

    throw new InternalServerErrorException(error.message);
  }
}
