import { seed } from './factory'

/** Cross-platform mobile and desktop application frameworks. */
export const MOBILE = [
  seed('flutter/flutter', 'mobile', ['frontend'], 'Dart', {
    d: "Google's UI toolkit for building beautiful compiled apps from one codebase across six platforms.",
    w: "Google's UI toolkit for every screen",
    t: 'Widgets Hot-reload Impeller Skia Dart',
    u: 'mobile-apps web-apps games design-systems', p: 'framework', diff: 'b',
    sig: [94, 94, 96, 90], s: 167000, topics: 'cross-platform widgets dart',
    alt: 'facebook/react-native JetBrains/kotlin JetBrains/compose-multiplatform',
  }),
  seed('facebook/react-native', 'mobile', ['frontend'], 'JavaScript', {
    d: 'Build truly native apps for iOS, Android and beyond using React primitives.',
    w: 'Build native apps using React',
    t: 'Native-components Fabric Hermes Bridgeless', l: 'TypeScript C++',
    u: 'mobile-apps web-apps', p: 'framework library', diff: 'i',
    sig: [92, 93, 95, 84], s: 121000, alt: 'flutter/flutter expo/expo',
  }),
  seed('expo/expo', 'mobile', ['devtools'], 'TypeScript', {
    d: 'The complete React Native platform: tooling, OTA updates, modules and cloud builds.',
    w: 'Complete React Native development platform',
    t: 'EAS OTA Modules Router Prebuild',
    u: 'mobile-apps dev-tooling', p: 'tool framework', diff: 'b',
    sig: [80, 98, 92, 94], s: 38000,
  }),
  seed('IonicTeam/ionic-framework', 'mobile', ['frontend'], 'TypeScript', {
    d: 'Cross-platform apps with web technologies — component library plus Capacitor native runtime.',
    w: 'Cross-platform apps using web technologies',
    t: 'Web-components Capacitor Pwa Angular React Vue',
    u: 'mobile-apps web-apps design-systems', p: 'framework library', diff: 'b',
    sig: [72, 78, 90, 86], s: 52000,
  }),
  seed('NativeScript/NativeScript', 'mobile', [], 'TypeScript', {
    d: 'True native mobile APIs directly from JavaScript/TypeScript without WebViews.',
    w: 'True native mobile apps from JavaScript',
    t: 'Native-access Direct-apis V8 Javascript-core',
    u: 'mobile-apps', p: 'framework', diff: 'i',
    sig: [56, 62, 82, 80], s: 24000, up: '2026-05',
  }),
  seed('JetBrains/compose-multiplatform', 'mobile', [], 'Kotlin', {
    d: 'Declarative Compose UI shared across Android, iOS, desktop and web via Kotlin Multiplatform.',
    w: 'Declarative Kotlin UI shared across platforms',
    t: 'Compose Kmp Shared-ui Skia Desktop',
    u: 'mobile-apps desktop-apps', p: 'framework', diff: 'i',
    sig: [60, 92, 88, 84], s: 17000, f: 1300,
  }),
  seed('electron/electron', 'mobile', ['frontend'], 'C++', {
    d: 'Desktop apps with web technologies: Chromium + Node.js powering VS Code, Slack and Discord.',
    w: 'Desktop apps using web technologies',
    t: 'Chromium Nodejs IPC Auto-update Native-menus', l: 'JavaScript TypeScript',
    u: 'desktop-apps web-apps', p: 'framework', diff: 'i',
    sig: [90, 92, 97, 84], s: 115000, alt: 'tauri-apps/tauri',
  }),
  seed('tauri-apps/tauri', 'mobile', ['security'], 'Rust', {
    d: 'Tiny, secure binaries for desktop AND mobile apps — system webview with a Rust core and strong IPC.',
    w: 'Tiny secure desktop app binaries',
    t: 'Rust-core System-webview Plugins Ipc Mobile',
    l: 'Rust TypeScript',
    u: 'desktop-apps security-hardening mobile-apps', p: 'framework', diff: 'a',
    sig: [84, 95, 88, 82], s: 90000, alt: 'electron/electron',
  }),
  seed('kivy/kivy', 'mobile', ['creative'], 'Python', {
    d: 'Cross-platform Python UI framework with GPU-accelerated multitouch interfaces.',
    w: 'Cross-platform Python UI framework',
    t: 'Multitouch Glsl Kv-language Buildozer',
    u: 'mobile-apps games learning', p: 'framework library', diff: 'i',
    sig: [58, 66, 80, 84], s: 18000,
  }),
  seed('SignalApp/Signal-Android', 'mobile', ['security'], 'Kotlin', {
    d: "Reference implementation of the world's most respected private messaging client (E2EE).",
    w: 'Reference private messaging client',
    t: 'E2ee Privacy Libsignal Calls Stickers',
    u: 'realtime-chat security-hardening mobile-apps', p: 'app-template', diff: 'i',
    sig: [70, 92, 96, 76], s: 26000,
  }),
]
