export type TCity = {
  id: number;
  name: string;
}

export type TArea = {
  id: number;
  name: string;
}

export type TMainSlider = {
  id: number;
  order: number;
  is_active: boolean;
  image: string;
  published_at: {
    human: string;
    date: string;
  };
}
