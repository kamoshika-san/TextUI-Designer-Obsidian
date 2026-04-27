import { ItemView, WorkspaceLeaf } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';
import React from 'react';
import PreviewPanel from './components/PreviewPanel';

export const VIEW_TYPE_TEXTUI = 'textui-preview';

export class TextUIPreviewView extends ItemView {
  private root: Root | null = null;

  getViewType(): string { return VIEW_TYPE_TEXTUI; }
  getDisplayText(): string { return 'TextUI Preview'; }

  async onOpen(): Promise<void> {
    const container = this.containerEl.children[1] as HTMLElement;
    container.empty();
    this.root = createRoot(container);
    this.root.render(React.createElement(PreviewPanel, {}));
  }

  async onClose(): Promise<void> {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }
}
