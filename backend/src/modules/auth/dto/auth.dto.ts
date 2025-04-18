import { ApiProperty } from '@nestjs/swagger';

class UserResponseDto {
  @ApiProperty({ description: 'ID do usuário' })
  user_id: number;

  @ApiProperty({ description: 'Email do usuário' })
  email: string;

  @ApiProperty({ description: 'Nome completo do usuário' })
  full_name: string;

  @ApiProperty({ description: 'Status de verificação do usuário' })
  is_verified: boolean;

  @ApiProperty({ description: 'URL da imagem de perfil', required: false })
  profile_image_url?: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'Token de acesso JWT' })
  access_token: string;

  @ApiProperty({ description: 'Dados do usuário', type: UserResponseDto })
  user: UserResponseDto;
}

export class RegisterResponseDto extends LoginResponseDto {}

export class ValidateTokenResponseDto {
  @ApiProperty({ description: 'Indica se o token é válido' })
  valid: boolean;
}