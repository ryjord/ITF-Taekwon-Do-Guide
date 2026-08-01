import { cn } from '../../lib/utils'
import { getBeltColorClass } from '../../lib/beltColors'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AudioPlayer } from './AudioPlayer'

const COLUMNS = ['English', 'Korean', 'Romanized', 'Pronunciation', 'Belt Level', 'Meaning']

// Expects a non-empty `terms` array; the caller (Terminology.jsx) renders its
// own empty state and only mounts this table when there are results.
export const TerminologyTable = ({ terms, className }) => {
  return (
    <div
      className={cn('overflow-hidden rounded-2xl border border-border bg-background shadow-lg', className)}
      role="region"
      aria-label="Taekwon-Do terminology table"
    >
      <Table aria-label="ITF Taekwon-Do terminology terms">
        <TableHeader className="bg-primary/5">
          <TableRow>
            {COLUMNS.map((column) => (
              <TableHead key={column} className="p-4 text-xs font-semibold uppercase tracking-wide text-foreground">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {terms.map((term) => (
            <TableRow key={term.id} className="group">
              <TableCell className="p-4 font-medium text-foreground group-hover:text-primary">
                {term.englishName}
              </TableCell>
              <TableCell className="font-korean p-4 text-lg font-medium text-primary">
                {term.koreanName}
              </TableCell>
              <TableCell className="p-4 font-mono text-sm text-foreground/70">{term.romanized}</TableCell>
              <TableCell className="p-4">
                <AudioPlayer audioSrc={term.sound} term={term.englishName} className="min-w-50" />
              </TableCell>
              <TableCell className="p-4">
                <Badge
                  className={cn('border px-3 py-1 text-xs font-semibold', getBeltColorClass(term.beltLearnt))}
                  aria-label={`Learned at ${term.beltLearnt} belt level`}
                >
                  {term.beltLearnt}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-normal p-4 text-sm leading-relaxed text-foreground/70">
                {term.meaning}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
