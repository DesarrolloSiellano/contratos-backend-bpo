import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Idempotency } from './entities/idempotency.entity';

@Injectable()
export class IdempotencyService {
  constructor(
    @InjectRepository(Idempotency)
    private readonly idempotencyRepository: Repository<Idempotency>,
  ) {}

  async findKey(key: string, method: string, path: string): Promise<Idempotency | null> {
    // Limpiar llaves expiradas antes de buscar (mantenimiento ligero)
    await this.idempotencyRepository.delete({
      expiresAt: LessThan(new Date()),
    });

    return this.idempotencyRepository.findOne({
      where: { key, method, path },
    });
  }

  async saveKey(key: string, method: string, path: string, response: any): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Guardamos por 24 horas

    const entry = this.idempotencyRepository.create({
      key,
      method,
      path,
      response,
      expiresAt,
    });

    await this.idempotencyRepository.save(entry);
  }
}
