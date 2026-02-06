import {Container} from 'pixi.js'

const SceneTypeValues = {
    START: 'START',
    GAME: 'GAME',
} as const

export type SceneType = (typeof SceneTypeValues)[keyof typeof SceneTypeValues]

export const SceneType = SceneTypeValues

export interface Scene extends Container {
    type: SceneType

    onEnter(): Promise<void> | void

    onExit(): Promise<void> | void

    onResize(width: number, height: number): void
}