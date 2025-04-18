import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valida as credenciais do usuário
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return null;
    }
    
    // Não retorna a senha no objeto de usuário
    const { password_hash, ...result } = user;
    return result;
  }

  /**
   * Realiza o login e retorna o token JWT
   */
  async login(user: any) {
    const payload = { email: user.email, sub: user.user_id };
    
    // Atualiza a data do último login
    await this.usersService.updateLastLogin(user.user_id);
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        is_verified: user.is_verified,
        profile_image_url: user.profile_image_url,
      },
    };
  }

  /**
   * Registra um novo usuário
   */
  async register(userData: any) {
    // Verifica se o email já está em uso
    const existingUser = await this.usersService.findByEmail(userData.email);
    if (existingUser) {
      throw new UnauthorizedException('Email já está em uso');
    }
    
    // Cria o novo usuário
    const newUser = await this.usersService.create(userData);
    
    // Retorna o token JWT
    const { password_hash, ...result } = newUser;
    return this.login(result);
  }

  /**
   * Verifica se o token JWT é válido
   */
  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findOne(payload.sub);
      
      if (!user) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtém o usuário a partir do token JWT
   */
  async getUserFromToken(token: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(token);
      return this.usersService.findOne(payload.sub);
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}