const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = process.cwd();
const historyPath = path.join(root, 'HISTORICO.md');

const files = [
  'src/app/core/auth/auth.service.ts',
  'src/app/core/auth/auth.interceptor.ts',
  'src/app/core/auth/auth.guard.ts',
  'src/app/core/auth/admin.guard.ts',
  'src/app/core/auth/guest.guard.ts',
  'src/app/features/auth/login.component.ts',
  'src/app/features/auth/login.component.html',
  'src/app/app.ts',
  'src/app/app.html',
  'src/app/app.scss',
  'src/app/core/ui/loading.service.ts',
  'src/app/app.config.ts',
  'src/app/features/settings/settings.component.ts',
  'src/app/features/settings/settings.component.html'
];

function readFileSafe(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return null; }
}

function statSafe(p) {
  try { return fs.statSync(p); } catch { return null; }
}

function formatDate(d) {
  return new Date(d).toISOString().replace('T', ' ').replace(/\..+/, '');
}

function generateSummary() {
  const entries = [];
  files.forEach((rel) => {
    const full = path.join(root, rel);
    const st = statSafe(full);
    if (st) entries.push({ file: rel.replace(/\\/g, '/'), mtime: st.mtimeMs });
  });
  entries.sort((a, b) => b.mtime - a.mtime);
  const now = new Date();
  const header = `- Atualizado em ${formatDate(now)}\n`;
  const bullets = entries.slice(0, 10).map((e) => `- ${e.file} (modificado: ${formatDate(e.mtime)})`).join('\n');
  return `${header}${bullets ? bullets + '\n' : ''}`;
}

function getGitCommits(limit = 10) {
  try {
    const format = '%h%x7C%ad%x7C%an%x7C%s';
    const cmd = `git log -n ${limit} --date=iso --pretty=format:${format}`;
    const out = execSync(cmd, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    return out.split(/\r?\n/).filter(Boolean).map((line) => {
      const [hash, date, author, subject] = line.split('|');
      return { hash, date, author, subject };
    });
  } catch {
    return [];
  }
}

function updateHistory() {
  const content = readFileSafe(historyPath);
  if (!content) {
    console.error('HISTORICO.md não encontrado');
    process.exit(1);
  }
  const startTag = '## Últimas mudanças';
  const startIdx = content.indexOf(startTag);
  if (startIdx === -1) {
    console.error('Seção "Últimas mudanças" não encontrada em HISTORICO.md');
    process.exit(2);
  }
  const afterStartIdx = startIdx + startTag.length;
  // Find next heading starting with "## " after start
  const rest = content.slice(afterStartIdx);
  const nextHeadingRel = rest.indexOf('\n## ');
  const endIdx = nextHeadingRel !== -1 ? afterStartIdx + nextHeadingRel : content.length;

  const before = content.slice(0, afterStartIdx);
  const after = content.slice(endIdx);
  const summary = '\n' + generateSummary() + '\n';
  const envLimitRaw = process.env.HISTORY_COMMITS_LIMIT || '';
  const envLimit = parseInt(envLimitRaw, 10);
  const limit = Number.isFinite(envLimit) && envLimit > 0 ? envLimit : 10;
  const commits = getGitCommits(limit);
  const commitsSection = commits.length
    ? `\n### Commits recentes\n` + commits.map((c) => `- ${c.hash} ${c.subject} (${c.author}, ${c.date})`).join('\n') + '\n'
    : '';
  const chatPath = path.join(root, 'HISTORICO-CHAT.md');
  const chatContent = readFileSafe(chatPath);
  const chatLimitRaw = process.env.HISTORY_CHAT_LINES_LIMIT || '';
  const chatLimitParsed = parseInt(chatLimitRaw, 10);
  const chatLimit = Number.isFinite(chatLimitParsed) && chatLimitParsed > 0 ? chatLimitParsed : 20;
  let chatSection = '';
  if (chatContent) {
    const lines = chatContent.split(/\r?\n/);
    const tail = lines.slice(Math.max(0, lines.length - chatLimit));
    const tailText = tail.join('\n');
    chatSection = tailText.trim().length ? `\n### Conversas recentes\n` + tailText + '\n' : '';
  }
  const updated = before + summary + commitsSection + chatSection + after;
  fs.writeFileSync(historyPath, updated, 'utf8');
}

updateHistory();
