import { seed } from './factory'

/** Game engines and HTML5 game frameworks. */
export const GAMEDEV = [
  seed('godotengine/godot', 'gamedev', ['creative', 'oss'], 'C++', {
    d: 'Fully-featured open-source game engine for 2D and 3D - scene nodes, GDScript, and zero royalties.',
    w: 'Fully-featured open-source game engine',
    t: 'GDScript Scene-nodes Physics Shaders Editor',
    u: 'games creative mobile-apps desktop-apps', p: 'engine tool', diff: 'i',
    sig: [92, 97, 94, 86], s: 93000, topics: 'game-engine 2d 3d gdscript',
    alt: 'bevyengine/bevy defold/defold',
  }),
  seed('phaserjs/phaser', 'gamedev', ['frontend'], 'JavaScript', {
    d: 'Fast, fun HTML5 2D game framework with physics, tweens and a gentle learning curve.',
    w: 'Fast fun HTML5 2D game framework',
    t: 'Canvas Webgl Arcade-physics Tilemaps Spine',
    l: 'TypeScript',
    u: 'games web-apps learning', p: 'framework library', diff: 'b',
    sig: [74, 80, 90, 90], s: 37000,
  }),
  seed('pixijs/pixijs', 'gamedev', ['creative'], 'TypeScript', {
    d: 'The fastest 2D WebGL/WebGPU renderer - used for games, ads, dataviz and interactive experiences.',
    w: 'Fastest 2D WebGL/WebGPU renderer',
    t: 'Webgl Webgpu Batching Filters Mesh Sprites',
    u: 'games design-systems dashboards-viz', p: 'library engine', diff: 'i',
    sig: [76, 88, 93, 82], s: 44000,
  }),
  seed('bevyengine/bevy', 'gamedev', [], 'Rust', {
    d: 'Refreshingly simple data-oriented Rust game engine built around ECS and rapid iteration.',
    w: 'Rust ECS game engine rising fast',
    t: 'ECS Data-oriented Systems Plugins Schedule',
    u: 'games creative', p: 'engine', diff: 'a',
    sig: [78, 99, 76, 84], s: 39000,
  }),
  seed('libgdx/libgdx', 'gamedev', [], 'Java', {
    d: 'Cross-platform Java game framework shipping to desktop, Android, iOS and WebGL from one codebase.',
    w: 'Cross-platform Java game development framework',
    t: 'Opengl Box2d Scene2d Robovm Gwt',
    u: 'games mobile-apps desktop-apps', p: 'framework', diff: 'i',
    sig: [64, 72, 88, 84], s: 24000,
  }),
  seed('monogame/MonoGame', 'gamedev', [], 'C#', {
    d: 'The XNA-successor C# framework behind Stardew Valley, Celeste and countless indie hits.',
    w: 'Framework behind Stardew Valley and Celeste',
    t: 'Xna Content-pipeline Shaders Cross-platform',
    u: 'games desktop-apps console', p: 'framework', diff: 'i',
    sig: [66, 85, 90, 82], s: 12000, f: 1500,
  }),
  seed('Unity-Technologies/UnityCsReference', 'gamedev', ['learning'], 'C#', {
    d: 'Reference source of Unity engine C# internals - an extraordinary codebase to read and learn from.',
    w: 'Reference source of Unity engine internals',
    t: 'Engine-internals Reading Learning Csharp',
    u: 'learning games dev-tooling', p: 'course', diff: 'a',
    sig: [62, 30, 40, 96], s: 15000, up: '2025-02',
  }),
]
