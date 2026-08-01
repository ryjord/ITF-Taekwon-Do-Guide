import {
  ArrowLeftRight,
  Award,
  Flame,
  Footprints,
  Gamepad2,
  GraduationCap,
  Grid3x3,
  Languages,
  Layers,
  ListChecks,
  Medal,
  Repeat,
  Rocket,
  ScrollText,
  Search,
  Shuffle,
  SignalHigh,
  SignalLow,
  SignalMedium,
  Star,
  Swords,
  Timer,
  Trophy,
  Zap,
} from 'lucide-react'

// The quiz data files (QuizCategories.json, achievements.json) store icons as
// emoji strings. Rather than migrate that data, these id -> lucide-icon maps
// translate them at render time.

export const CATEGORY_ICONS = {
  terminology: Languages,
  patterns: Repeat,
  techniques: Swords,
  history: ScrollText,
}

export const DIFFICULTY_ICONS = {
  easy: SignalLow,
  medium: SignalMedium,
  hard: SignalHigh,
}

export const DIFFICULTY_BADGE_VARIANT = {
  easy: 'secondary',
  medium: 'default',
  hard: 'destructive',
}

export const GAME_TYPE_ICONS = {
  mcq: ListChecks,
  wordsearch: Search,
  crossword: Grid3x3,
  translation: ArrowLeftRight,
  flashcards: Layers,
  matching: Shuffle,
}

export const ACHIEVEMENT_ICONS = {
  first_game: Footprints,
  perfect_score: Star,
  speed_demon: Zap,
  terminology_master: GraduationCap,
  pattern_pro: Repeat,
  game_collector: Gamepad2,
  marathon_player: Timer,
  point_master: Trophy,
  quick_learner: Rocket,
  achievement_hunter: Medal,
}

export const DEFAULT_ACHIEVEMENT_ICON = Award
