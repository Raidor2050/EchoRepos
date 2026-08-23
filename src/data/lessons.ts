/**
 * The Learn track - 12 concepts in dependency order.
 * Each lesson: short, plain-language, diagram-first. ~3 min read each.
 */

export interface Lesson {
  slug: string
  title: string
  tagline: string
  minutes: number
  icon: string
  body: string[]
  terms?: Array<{ term: string; def: string }>
}

export const LESSONS: Lesson[] = [
  {
    slug: 'open-source',
    title: 'What is open source?',
    tagline: 'Code shared with the world, free to use, study and improve.',
    minutes: 3,
    icon: '🌍',
    body: [
      'Open source software is code published under a license that lets anyone use, read, modify and share it. Linux, VS Code, React, Python - the internet runs on it.',
      '"Free" here means freedom, not price. A license (MIT, Apache-2.0, GPL) defines what you may do: almost everything, as long as you keep the copyright notice - and for some licenses, share your changes too.',
      'Companies pay engineers to work on open source because shared infrastructure beats every company rebuilding the same wheel.',
    ],
    terms: [
      { term: 'License', def: 'The legal rules attached to the code. MIT = do nearly anything, keep the notice.' },
      { term: 'Ecosystem', def: 'The network of projects that depend on each other.' },
    ],
  },
  {
    slug: 'git',
    title: 'Git - time travel for code',
    tagline: 'A version control system that records every change, forever.',
    minutes: 4,
    icon: '🕰️',
    body: [
      'Git is a command-line tool that tracks changes to a folder of files. Instead of "final_v2_REAL.js" you get a precise history you can rewind, branch and merge.',
      'Every snapshot is a commit (more on that soon). Git stores them locally on your machine - no internet needed. GitHub is the website where those histories get shared.',
      'You will use git daily as a contributor: clone, branch, commit, push. The vocabulary feels alien for a week, then becomes muscle memory.',
    ],
    terms: [
      { term: 'clone', def: 'Download a full copy of a repository with its entire history.' },
      { term: 'push / pull', def: 'Upload your commits to a remote / fetch commits from it.' },
    ],
  },
  {
    slug: 'github',
    title: 'GitHub - home of the repos',
    tagline: 'Where code lives, teams collaborate and careers are built.',
    minutes: 3,
    icon: '🐙',
    body: [
      'GitHub hosts git repositories and wraps them with collaboration tools: issues, pull requests, reviews, releases, actions. GitLab and Bitbucket are alternatives; GitHub is the largest by far.',
      'Your profile page shows your public work. Contributions, projects and discussions form a public portfolio that recruiters actually read.',
      'Everything on this site links to real GitHub repositories. When a project says "star it", that button lives on github.com.',
    ],
    terms: [{ term: 'Remote', def: 'A copy of the repo hosted online - usually called "origin".' }],
  },
  {
    slug: 'repository',
    title: 'Repository - the project container',
    tagline: 'One repo = one project: code + history + discussion.',
    minutes: 3,
    icon: '📦',
    body: [
      'A repository ("repo") is a project\'s folder plus its complete git history plus its collaboration surface: README, issues, pull requests, settings.',
      'URLs map directly: github.com/owner/name. facebook/react is the React repo, owned by the facebook organization.',
      'Repos can be public (anyone can see and fork) or private (invited people only). Open source lives in public repos.',
    ],
  },
  {
    slug: 'commit',
    title: 'Commit - one saved change',
    tagline: 'A labeled snapshot with author, message and timestamp.',
    minutes: 3,
    icon: '📸',
    body: [
      'A commit records exactly what changed since the last one, who did it, when, and why (the message). Commits chain together into history - like save points in a game.',
      'Good commit messages say what and why: "Fix login crash on Safari" beats "update". Maintainers read these when reviewing your work.',
      'Each commit gets a short hash (a1f0c3) used to reference it. You can view, revert or undo any point in history.',
    ],
    terms: [{ term: 'diff', def: 'The line-by-line change set inside a commit, shown in green/red.' }],
  },
  {
    slug: 'branch',
    title: 'Branch - parallel timelines',
    tagline: 'Work on new ideas without breaking the main version.',
    minutes: 3,
    icon: '🌿',
    body: [
      'A branch is an independent line of development. The default branch - usually "main" - is the stable version. Create a branch to try a feature; main stays untouched.',
      'Branches are cheap and instant in git. Typical flow: branch → commit several times → merge back via a pull request.',
      'Naming helps reviewers: "fix/login-crash" tells everyone exactly what lives on that timeline.',
    ],
  },
  {
    slug: 'fork',
    title: 'Fork - your own copy',
    tagline: 'How outside contributors work on projects they don\'t own.',
    minutes: 3,
    icon: '🍴',
    body: [
      'A fork is a personal copy of someone else\'s repository under your account. You can change anything in your copy without asking permission.',
      'The contribution dance: fork the repo → clone YOUR fork → create a branch → commit fixes → push → open a pull request proposing your changes to the original.',
      'Forks also preserve abandoned projects: if the original dies, the community continues from the most active fork.',
    ],
    terms: [{ term: 'upstream', def: 'The original repo your fork was copied from.' }],
  },
  {
    slug: 'star',
    title: 'Stars - the applause button',
    tagline: 'Bookmark a repo and signal that it matters.',
    minutes: 2,
    icon: '⭐',
    body: [
      'Starring a repo bookmarks it to your profile and adds to its star count. Stars are the de-facto popularity metric of open source.',
      'They are noisy - marketing drives stars too - but a project with 50k+ stars has serious momentum, community and usually long-term maintenance behind it.',
      'On EchoRepos, star counts appear as ★ next to every project. Trending lists are largely star velocity.',
    ],
  },
  {
    slug: 'issue',
    title: 'Issues - the todo board',
    tagline: 'Bugs, feature ideas and questions, all in public.',
    minutes: 3,
    icon: '🎫',
    body: [
      'Issues are a repo\'s public tracker: bug reports, feature requests, discussions. Each has a number (#123), labels, and a thread.',
      'For newcomers, issues labeled "good first issue" or "help wanted" are invitations - small, well-scoped tasks maintainers want help with.',
      'Commenting on issues (reproducing bugs, confirming behavior) is real contribution before writing a single line of code.',
    ],
  },
  {
    slug: 'pull-request',
    title: 'Pull requests - proposing changes',
    tagline: '"Here is my work - please pull it into the project."',
    minutes: 4,
    icon: '🔀',
    body: [
      'A pull request (PR) says: "I changed these lines on my branch/fork - consider merging them into yours." It shows the diff, runs tests, and gathers review comments.',
      'Maintainers review: request changes or approve. Once approved and CI passes, they merge it. Your name enters the project\'s history permanently.',
      'PR etiquette: small diffs, clear descriptions, link the issue it fixes ("Closes #123"). Small PRs get merged fast; giant ones rot.',
    ],
    terms: [
      { term: 'review', def: 'Line-by-line feedback from maintainers before merge.' },
      { term: 'CI', def: 'Automatic checks (build, tests, lint) that must pass first.' },
    ],
  },
  {
    slug: 'contributor',
    title: 'Contributors - who builds this?',
    tagline: 'From typo fixes to core architecture - every merge counts.',
    minutes: 3,
    icon: '👥',
    body: [
      'Anyone whose PR got merged is a contributor, shown in the repo\'s graph and often in CONTRIBUTORS.md. First merged PR is a genuine credential.',
      'Contribution isn\'t only code: docs, translations, design, issue triage and answering questions all count and are desperately needed.',
      'Start small - fix a typo, improve a README, add a test. Momentum matters more than size; maintainers learn to trust consistent contributors.',
    ],
  },
  {
    slug: 'release',
    title: 'Releases & versions',
    tagline: 'Packaged milestones you can actually install.',
    minutes: 3,
    icon: '🚀',
    body: [
      'A release marks a stable checkpoint: tagged code, changelog notes, downloadable artifacts. Apps publish binaries; libraries publish packages (npm install ...).',
      'Versions follow semver: MAJOR.MINOR.PATCH. Breaking changes bump the major; new features minor; fixes patch. v2.4.1 = safe upgrade, v3.0.0 = read the migration guide.',
      'Active release history is a health signal - it means someone is maintaining the project. EchoRepos shows last-update dates for exactly this reason.',
    ],
    terms: [{ term: 'semver', def: 'Semantic versioning - the MAJOR.MINOR.PATCH convention.' }],
  },
]

export const TRACK_ORDER = LESSONS.map((l) => l.slug)
