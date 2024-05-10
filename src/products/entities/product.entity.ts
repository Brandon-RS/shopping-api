import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'text', unique: true })
  name: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column({ type: 'int', default: 0 })
  stock: string;

  @Column({ type: 'text', array: true })
  sizes: string[];

  @Column({ type: 'text' })
  gender: string;
}
