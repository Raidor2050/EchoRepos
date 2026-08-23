import { seed } from './factory'

/** Languages, compilers and foundational infrastructure. */
export const OSSCORE = [
  seed('torvalds/linux', 'oss', ['devops'], 'C', {
    d: 'The kernel running most of the internet, all of Android and the majority of the cloud.',
    w: 'Kernel running most of the internet',
    t: 'Kernel Drivers Syscalls Schedulers Filesystems',
    u: 'deploy-infra dev-tooling learning', p: 'engine', diff: 'a',
    sig: [97, 99, 100, 52], s: 190000, topics: 'kernel operating-system posix',
  }),
  seed('python/cpython', 'oss', ['datasci'], 'Python', {
    d: 'The reference implementation of Python — interpreter, standard library and C API.',
    w: 'The reference implementation of Python',
    t: 'Interpreter Bytecode Gc C-api Stdlib',
    l: 'C',
    u: 'learning dev-tooling data-pipelines', p: 'engine', diff: 'a',
    sig: [88, 96, 100, 76], s: 66000,
  }),
  seed('rust-lang/rust', 'oss', ['webdev'], 'Rust', {
    d: 'A language empowering everyone to build reliable, memory-safe software without garbage collection.',
    w: 'Language empowering everyone building reliable software',
    t: 'Ownership Borrow-checker Cargo Macros Async',
    l: 'Rust',
    u: 'learning dev-tooling games deploy-infra', p: 'engine tool', diff: 'a',
    sig: [92, 98, 98, 84], s: 103000,
  }),
  seed('golang/go', 'oss', ['backend'], 'Go', {
    d: "Google's language for simple, scalable software: fast compiles, first-class concurrency.",
    w: "Google's language for simple scalable software",
    t: 'Goroutines Channels Gc Modules Toolchain',
    u: 'learning dev-tooling apis deploy-infra', p: 'engine', diff: 'i',
    sig: [90, 95, 99, 82], s: 126000,
  }),
  seed('llvm/llvm-project', 'oss', [], 'C++', {
    d: 'Modular compiler toolchain powering Clang, Swift, Rust codegen and GPU shader stacks.',
    w: 'Modular compiler toolchain powering everything',
    t: 'Ir Optimizations Clang Codegen Jit',
    u: 'learning dev-tooling ai-integration', p: 'engine library', diff: 'a',
    sig: [78, 96, 99, 60], s: 32000,
  }),
  seed('freebsd/freebsd-src', 'oss', ['security'], 'C', {
    d: 'Battle-tested Unix-like OS powering critical infrastructure — ZFS, jails and legendary networking.',
    w: 'Battle-tested Unix powering critical infrastructure',
    t: 'Unix Zfs Jails Networking Ports',
    u: 'deploy-infra security-hardening learning', p: 'engine', diff: 'a',
    sig: [58, 90, 99, 62], s: 8000, f: 1800,
  }),
  seed('systemd/systemd', 'oss', ['automation'], 'C++', {
    d: 'Core Linux init and service manager — units, timers, sockets and the plumbing of modern distros.',
    w: 'Core Linux init and service manager',
    t: 'Units Timers Sockets Journald Udev',
    l: 'C',
    u: 'deploy-infra automation-scraping dev-tooling', p: 'engine tool', diff: 'i',
    sig: [64, 94, 98, 68], s: 14000,
  }),
  seed('bitcoin/bitcoin', 'oss', ['security'], 'C++', {
    d: 'Reference implementation of Bitcoin Core — consensus rules, cryptography and P2P networking.',
    w: 'Reference implementation of Bitcoin Core',
    t: 'Consensus Cryptography P2p Wallet Mempool',
    u: 'security-hardening learning data-storage', p: 'engine cli self-hosted', diff: 'a',
    sig: [86, 92, 99, 70], s: 83000,
  }),
]
