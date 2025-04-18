import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Cria um novo usuário
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verifica se o email já está em uso
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('Email já está em uso');
    }

    // Verifica se o CPF já está em uso
    const existingCpf = await this.usersRepository.findOne({ where: { cpf: createUserDto.cpf } });
    if (existingCpf) {
      throw new BadRequestException('CPF já está em uso');
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Cria o novo usuário
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password_hash: hashedPassword,
    });

    return this.usersRepository.save(newUser);
  }

  /**
   * Busca todos os usuários
   */
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Busca um usuário pelo ID
   */
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { user_id: id } });
    
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    
    return user;
  }

  /**
   * Busca um usuário pelo email
   */
  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  /**
   * Atualiza um usuário
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    // Se estiver atualizando a senha, criptografa a nova senha
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password_hash = await bcrypt.hash(updateUserDto.password, salt);
      delete updateUserDto.password;
    }
    
    // Atualiza o usuário
    const updatedUser = this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(updatedUser);
  }

  /**
   * Remove um usuário
   */
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  /**
   * Atualiza a data do último login
   */
  async updateLastLogin(id: number): Promise<void> {
    await this.usersRepository.update(id, {
      last_login: new Date(),
    });
  }

  /**
   * Verifica um usuário
   */
  async verifyUser(id: number): Promise<User> {
    const user = await this.findOne(id);
    
    user.is_verified = true;
    user.verification_status = 'verified';
    
    return this.usersRepository.save(user);
  }

  /**
   * Atualiza o saldo da carteira do usuário
   */
  async updateWalletBalance(id: number, amount: number, operation: 'add' | 'subtract'): Promise<User> {
    const user = await this.findOne(id);
    
    if (operation === 'add') {
      user.wallet_balance += amount;
    } else {
      if (user.wallet_balance < amount) {
        throw new BadRequestException('Saldo insuficiente');
      }
      user.wallet_balance -= amount;
    }
    
    return this.usersRepository.save(user);
  }
}