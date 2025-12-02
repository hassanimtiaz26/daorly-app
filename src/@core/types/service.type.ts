import { TCategory } from '@core/types/category.type';
import { TMediaAttachment } from '@core/types/media.type';

export type TService = {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  category: TCategory;
  image: TMediaAttachment;
  images: TMediaAttachment[];
}
