import { Vault } from 'obsidian';

export async function readDslFile(vault: Vault, path: string): Promise<string> {
  const exists = await vault.adapter.exists(path);
  if (!exists) {
    throw new Error(`DSL file not found: ${path}`);
  }
  return vault.adapter.read(path);
}
