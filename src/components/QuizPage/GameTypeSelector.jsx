import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { GAME_TYPE_ICONS } from './quizIcons'

export const GameTypeSelector = ({ gameTypes, selectedGameType, onGameTypeSelect }) => {
  const handleGameTypeClick = (gameTypeId) => {
    onGameTypeSelect(selectedGameType === gameTypeId ? null : gameTypeId)
  }

  return (
    <div className="flex flex-wrap justify-center gap-3" role="group" aria-label="Select game type">
      {gameTypes.map((gameType) => {
        const isSelected = selectedGameType === gameType.id
        const Icon = GAME_TYPE_ICONS[gameType.id]

        return (
          <Button
            key={gameType.id}
            variant={isSelected ? 'default' : 'outline'}
            onClick={() => handleGameTypeClick(gameType.id)}
            className={cn(
              'h-auto w-full min-w-70 max-w-80 items-start gap-3 px-5 py-3 text-left sm:w-auto',
              isSelected && 'scale-105 shadow-md'
            )}
            aria-pressed={isSelected}
            aria-label={`${gameType.name} game type: ${gameType.description}. ${isSelected ? 'Selected' : 'Click to select'}`}
          >
            {Icon && <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />}
            <div className="min-w-0 flex-1 whitespace-normal">
              <div className="text-base leading-tight font-semibold">{gameType.name}</div>
              <div className={cn('mt-1 text-xs leading-snug', isSelected ? 'opacity-90' : 'opacity-70')}>
                {gameType.description}
              </div>
            </div>
          </Button>
        )
      })}
    </div>
  )
}
