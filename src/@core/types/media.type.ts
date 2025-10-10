export type TMediaAttachment = {
  mediableId: number;
  mediableType: string;
  media: TMedia;
}

export type TMedia = {
  id: number;
  path: string;
  url: string;
  mimetype: string;
  size: string;
  rawSize: number;
}
