/**
 * How much of the AI-drafted code survived human review.
 *
 * Drafts are committed untouched with an `AI-Draft: <skill>` trailer (see the explore-and-generate-screens
 * skill). For every file of such a commit, `git blame` at HEAD tells how many of its drafted lines are still
 * there unchanged: kept = surviving drafted lines / drafted lines; edited = the rest (changed or deleted).
 *
 * Usage: npm run ai:edit-stats
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const git = (...args: string[]): string => execFileSync('git', args, { encoding: 'utf8' });

type Row = { draft: string; file: string; drafted: number; kept: number };

function draftCommits(): { sha: string; subject: string }[] {
  return git('log', '--format=%H%x09%s', '--grep=^AI-Draft:')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [sha, subject] = line.split('\t');
      return { sha, subject };
    });
}

/** Lines each file gained in the draft commit (binary files report "-" and are skipped). */
function draftedLines(sha: string): { file: string; added: number }[] {
  return git('show', '--numstat', '--format=', sha)
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split('\t'))
    .filter(([added]) => added !== '-')
    .map(([added, , file]) => ({ file, added: Number(added) }));
}

/** Lines of `file` at HEAD that `git blame` still attributes to `sha`. */
function survivingLines(sha: string, file: string): number {
  if (!existsSync(file)) return 0;
  return git('blame', '--line-porcelain', 'HEAD', '--', file)
    .split('\n')
    .filter((line) => line.startsWith(`${sha} `)).length;
}

const rows: Row[] = draftCommits().flatMap(({ sha }) =>
  draftedLines(sha).map(({ file, added }) => ({ draft: sha.slice(0, 7), file, drafted: added, kept: survivingLines(sha, file) })),
);

if (rows.length === 0) {
  console.log('No AI drafts yet: commits with an "AI-Draft:" trailer are what this measures.');
  process.exit(0);
}

const pct = (part: number, whole: number) => (whole === 0 ? '-' : `${Math.round((part / whole) * 100)}%`);
console.table(
  rows.map((r) => ({ draft: r.draft, file: r.file, drafted: r.drafted, kept: r.kept, edited: pct(r.drafted - r.kept, r.drafted) })),
);
const drafted = rows.reduce((s, r) => s + r.drafted, 0);
const kept = rows.reduce((s, r) => s + r.kept, 0);
console.log(`Total: ${drafted} drafted lines, ${kept} kept as generated (${pct(kept, drafted)}), ${pct(drafted - kept, drafted)} edited by humans.`);
