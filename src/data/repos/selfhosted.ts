import { seed } from './factory'

/** Self-hosted applications people actually run at home. */
export const SELFHOSTED = [
  seed('home-assistant/core', 'automation', ['mobile'], 'Python', {
    d: 'Local-first smart-home hub with thousands of integrations, prioritizing privacy over cloud lock-in.',
    w: 'Local smart-home hub prioritizing privacy',
    t: 'Integrations Zigbee MQTT Automations Voice',
    u: 'automation-scraping mobile-apps realtime-chat', p: 'self-hosted', diff: 'i',
    sig: [88, 97, 92, 80], s: 78000, topics: 'smart-home iot privacy local-first',
  }),
  seed('paperless-ngx/paperless-ngx', 'automation', [], 'Python', {
    d: 'Scan-and-index document management: OCR everything, tag automatically, find anything instantly.',
    w: 'Scan-and-index document management system',
    t: 'OCR Tagging Full-text-search Machine-learning Django',
    u: 'automation-scraping data-storage learning', p: 'self-hosted app-template', diff: 'b',
    sig: [74, 96, 90, 82], s: 26000,
  }),
  seed('changedetection.io/changedetection.io', 'automation', [], 'Python', {
    d: 'Website change monitoring with alerts — price drops, restocks, defacements and diffs.',
    w: 'Website change monitoring with alerts',
    t: 'Diff-watch Visual-diff Playwright Re-stock Alerts',
    l: 'HTML',
    u: 'automation-scraping security-hardening', p: 'self-hosted tool', diff: 'b',
    sig: [68, 94, 86, 82], s: 25000,
  }),
  seed('immich-app/immich', 'automation', ['mobile', 'ai'], 'TypeScript', {
    d: 'High-performance self-hosted photo/video backup with mobile sync and ML face search.',
    w: 'High-performance self-hosted photo/video backup',
    t: 'Photos Mobile-sync Face-recognition ML Backup',
    u: 'mobile-apps ai-integration data-storage', p: 'self-hosted app-template', diff: 'b',
    sig: [84, 99, 88, 80], s: 70000,
  }),
  seed('blakeblackshear/frigate', 'automation', ['ai'], 'Python', {
    d: 'Real-time AI object detection NVR for security cameras — local, fast and Home-Assistant friendly.',
    w: 'Real-time AI object detection NVR',
    t: 'NVR Object-detection Coral Tensorrt Mqtt',
    u: 'security-hardening ai-integration automation-scraping', p: 'self-hosted', diff: 'i',
    sig: [72, 95, 86, 76], s: 25000,
  }),
]
