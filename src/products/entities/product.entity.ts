import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  name: string;

  @Column({ type: 'float', default: 0 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'text', array: true })
  sizes: string[];

  @Column({ type: 'text' })
  gender: string;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.name;
    }

    this.slug = this.slug.toLowerCase().replace(/ /g, '-');
  }
}
