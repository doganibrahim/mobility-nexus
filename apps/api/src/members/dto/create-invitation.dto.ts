import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsIn } from 'class-validator';

export class CreateInvitationDto {
  @ApiProperty({
    example: 'ogretmen@okul.edu.tr',
    description: 'Davet edilecek kurum yetkilisinin e-posta adresi',
  })
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz.' })
  @IsNotEmpty({ message: 'E-posta alanı zorunludur.' })
  email: string;

  @ApiProperty({
    enum: ['ORG_ADMIN', 'MEMBER', 'VIEWER'],
    example: 'MEMBER',
    description: 'Kullanıcıya atanacak kurum içi yetki rolü',
  })
  @IsIn(['ORG_ADMIN', 'MEMBER', 'VIEWER'], {
    message: 'Geçerli bir rol seçiniz (ORG_ADMIN, MEMBER, VIEWER).',
  })
  role: 'ORG_ADMIN' | 'MEMBER' | 'VIEWER';
}

export class AcceptInvitationDto {
  @ApiProperty({
    example: 'inv-tok-98471284918247',
    description: 'E-postayla iletilen tek kullanımlık güvenlik tokenı',
  })
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'Ahmet Yılmaz', description: 'Kullanıcının tam adı' })
  @IsNotEmpty()
  fullName: string;
}
