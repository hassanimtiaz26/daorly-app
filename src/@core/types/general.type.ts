export type TCity = {
  id: number;
  name: string;
}

export type TArea = {
  id: number;
  cityId: number;
  name: string;
  city?: TCity;
}

export type TMainSlider = {
  id: number;
  order: number;
  isActive: boolean;
  image: string;
}

export type TSelectValues = {
  value: string;
  list: Array<{ _id: string; value: string }>;
  selectedList: Array<{ _id: string; value: string }>;
  error: string;
}
