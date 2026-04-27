import * as YAML from 'yaml';

export type ParseResult = { dsl: unknown } | { error: string };

export function parseDsl(yamlContent: string): ParseResult {
  try {
    const dsl = YAML.parse(yamlContent);
    return { dsl };
  } catch (e) {
    return { error: String(e) };
  }
}
