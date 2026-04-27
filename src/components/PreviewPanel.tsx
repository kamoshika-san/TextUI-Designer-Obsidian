import React from 'react';
import type { ParseResult } from '../core-adapter';

interface Props {
  result?: ParseResult;
}

export default function PreviewPanel({ result }: Props): React.ReactElement {
  if (result === undefined) {
    return <div>Loading...</div>;
  }
  if ('error' in result) {
    return <div style={{ color: 'red' }}>{result.error}</div>;
  }
  if (!('page' in result.dsl)) {
    return <div>Navigation Flow DSL</div>;
  }

  return (
    <section>
      <h2>{result.dsl.page.title}</h2>
      <div>Page ID: {result.dsl.page.id}</div>
    </section>
  );
}
