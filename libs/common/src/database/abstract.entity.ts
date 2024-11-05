import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AbstractEntity<T> {
  @PrimaryGeneratedColumn()
  _id: number;

  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }
}
