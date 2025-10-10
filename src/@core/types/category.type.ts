import { TMediaAttachment } from '@core/types/media.type';

export type TCategory = {
  id: number;
  name: string;
  description: string;
  image: TMediaAttachment;
}
