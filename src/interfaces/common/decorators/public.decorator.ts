import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '@/interfaces/guards/jwt-auth.guard';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
