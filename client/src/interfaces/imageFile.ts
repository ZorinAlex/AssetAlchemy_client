export interface IImageFile {
  name: string,
  type: string,
  id: string,
  url: string,
  file: File
}

export interface IImageChar {
  image: IImageFile,
  char: string,
  width: number,
  height: number,
  xoffset: number,
  yoffset: number,
  xadvance: number,
}

export interface IBehaviorUpdate{
  behavior: Object,
  active: boolean
}
