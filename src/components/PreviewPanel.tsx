import React from 'react';

interface Props {
  dslContent?: string;
  error?: string;
}

export default function PreviewPanel({ dslContent, error }: Props): React.ReactElement {
  if (error !== undefined) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }
  if (dslContent === undefined) {
    return <div>Loading...</div>;
  }
  return <pre>{dslContent}</pre>;
}
