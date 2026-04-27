import * as YAML from 'yaml';
import { normalizeDslDomain } from 'textui-designer/core/textui-core-engine-domain';
import type { NavigationFlowDSL, TextUIDSL } from 'textui-designer/domain/dsl-types';

export type ParseResult = { dsl: TextUIDSL | NavigationFlowDSL } | { error: string };

export function parseDsl(yamlContent: string): ParseResult {
  try {
    const parsedDsl = parseYamlContent(yamlContent);
    const normalizedDsl = normalizeDslDomain(parsedDsl, 'ui');
    return { dsl: normalizedDsl };
  } catch (e) {
    return { error: String(e) };
  }
}

function parseYamlContent(yamlContent: string): unknown {
  const trimmed = yamlContent.trim();

  if (!trimmed) {
    throw new Error('DSL text is empty.');
  }

  return YAML.parse(trimmed);
}
