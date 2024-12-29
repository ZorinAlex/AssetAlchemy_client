import { IImageFile } from 'src/interfaces/imageFile';
import { Texture } from 'pixi.js';

export enum EBehaviours {
  COLOR = "color", COLOR_STATIC = "colorStatic",
  ALPHA = "alpha", ALPHA_STATIC = "alphaStatic",
  SCALE = "scale", SCALE_STATIC = "scaleStatic",
  ROTATION = "rotation", ROTATION_STATIC = "rotationStatic", ROTATION_NO = "noRotation",
  MOVE_SPEED = "moveSpeed", MOVE_SPEED_STATIC = "moveSpeedStatic",
  MOVE_ACCELERATION = "moveAcceleration",
  MOVE_PATH = "movePath",
  ANIMATED_RANDOM = "animatedRandom", ANIMATED_SINGLE = "animatedSingle",
  TEXTURE_ORDERED = "textureOrdered", TEXTURE_RANDOM = "textureRandom", TEXTURE_SINGLE = "textureSingle",
  SPAWN_BURST = "spawnBurst",
  SPAWN_SHAPE = "spawnShape",
  BLEND_MODE = "blendMode",
}

export function getBehaviour(type: EBehaviours, config: any){
  return {
    type,
    config
  }
}

export const allBlendModes = [
  'normal',
  'add',
  'screen',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'linear-burn',
  'linear-dodge',
  'linear-light',
  'hard-light',
  'soft-light',
  'pin-light',
  'difference',
  'exclusion',
  'overlay',
  'saturation',
  'color',
  'luminosity',
  'add-npm',
  'subtract',
  'divide',
  'vivid-light',
  'hard-mix',
  'negation',
];

export enum EShape{
  CIRCLE='circle', RECT='rect', TORUS='torus'
}

export function getTextureFromImage(image: IImageFile){
  const texture = Texture.from(image.url);
  texture['filename'] = image.name;
  texture['url'] = image.url;
  texture.toJSON = ()=>{
    return texture['filename']
  }
  return texture
}
