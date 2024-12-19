export interface IImageFile {
  name: string,
  type: string,
  id: string,
  url: string,
  file: File
}

export interface IImageChar{
  image: IImageFile,
  char: string
}
