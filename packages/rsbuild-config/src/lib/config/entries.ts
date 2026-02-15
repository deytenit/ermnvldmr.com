import { join } from 'node:path';
import fg from 'fast-glob';

export function discoverEntries(root: string, pattern: string): Record<string, string> {
  const files = fg.sync(pattern, { cwd: root });
  const entries: Record<string, string> = {};

  for (const file of files) {
    // We expect the user to provide a pattern like './src/app/*.tsx'
    // We'll strip the directory parts to get the name
    const parts = file.split('/');
    // Remove extension from the last part
    const filename = parts[parts.length - 1].replace(/\.tsx$/, '');
    
    // For nested routes, we might want to keep the path but relative to the app root
    // But since you want 'index', 'articles/index', etc.
    // Let's just use the file path relative to the common root 'src/app' if it exists in the path
    const appMatch = file.match(/src\/app\/(.*)\.tsx$/);
    let name = appMatch ? appMatch[1] : filename;
    
    // If it's src/app/articles/index.tsx -> name is 'articles/index'
    // We want it to be 'articles/index' to generate 'dist/articles/index.html'
    // Rsbuild automatically maps 'articles/index' entry to 'dist/articles/index.html'
    // The previous replace(/\/index$/, '') was stripping the 'index' making it 'articles'
    // which generates 'dist/articles.html' instead of 'dist/articles/index.html'
    
    entries[name] = join(root, file);
  }
  
  return entries;
}
