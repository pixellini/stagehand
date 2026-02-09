import * as PIXI from 'pixi.js'
import { StageEntityMixin } from '../core/Entity.ts'

export const StageAnimatedSprite = StageEntityMixin(PIXI.AnimatedSprite)
export type StageAnimatedSprite = InstanceType<typeof StageAnimatedSprite>

export const StageContainer = StageEntityMixin(PIXI.Container)
export type StageContainer = InstanceType<typeof StageContainer>

export const StageDOMContainer = StageEntityMixin(PIXI.DOMContainer)
export type StageDOMContainer = InstanceType<typeof StageDOMContainer>

export const StageMeshPlane = StageEntityMixin(PIXI.MeshPlane)
export type StageMeshPlane = InstanceType<typeof StageMeshPlane>

export const StageMeshRope = StageEntityMixin(PIXI.MeshRope)
export type StageMeshRope = InstanceType<typeof StageMeshRope>

export const StageGraphics = StageEntityMixin(PIXI.Graphics)
export type StageGraphics = InstanceType<typeof StageGraphics>

export const StageNineSliceSprite = StageEntityMixin(PIXI.NineSliceSprite)
export type StageNineSliceSprite = InstanceType<typeof StageNineSliceSprite>

export const StageParticleContainer = StageEntityMixin(PIXI.ParticleContainer)
export type StageParticleContainer = InstanceType<typeof StageParticleContainer>

export const StagePerspectiveMesh = StageEntityMixin(PIXI.PerspectiveMesh)
export type StagePerspectiveMesh = InstanceType<typeof StagePerspectiveMesh>

export const StageRenderLayer = StageEntityMixin(PIXI.RenderLayer)
export type StageRenderLayer = InstanceType<typeof StageRenderLayer>

export const StageSprite = StageEntityMixin(PIXI.Sprite)
export type StageSprite = InstanceType<typeof StageSprite>

export const StageTilingSprite = StageEntityMixin(PIXI.TilingSprite)
export type StageTilingSprite = InstanceType<typeof StageTilingSprite>