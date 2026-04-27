import { ItemView, TAbstractFile, WorkspaceLeaf } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';
import React from 'react';
import PreviewPanel from './components/PreviewPanel';
import type TextUIDesignerPlugin from './main';
import { readDslFile } from './dsl-reader';
import { parseDsl } from './core-adapter';

export const VIEW_TYPE_TEXTUI = 'textui-preview';

export class TextUIPreviewView extends ItemView {
  private root: Root | null = null;
  private readonly plugin: TextUIDesignerPlugin;
  private modifyHandler: ((file: TAbstractFile) => void) | null = null;

  constructor(leaf: WorkspaceLeaf, plugin: TextUIDesignerPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string { return VIEW_TYPE_TEXTUI; }
  getDisplayText(): string { return 'TextUI Preview'; }

  async onOpen(): Promise<void> {
    const container = this.containerEl.children[1] as HTMLElement;
    container.empty();
    this.root = createRoot(container);
    await this.renderPreview();
    this.modifyHandler = (file: TAbstractFile) => {
      if (file.path === this.plugin.settings.defaultDslPath) {
        void this.renderPreview();
      }
    };
    this.app.vault.on('modify', this.modifyHandler);
  }

  async onClose(): Promise<void> {
    if (this.modifyHandler) {
      this.app.vault.off('modify', this.modifyHandler);
      this.modifyHandler = null;
    }
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }

  private async renderPreview(): Promise<void> {
    if (!this.root) {
      return;
    }

    const path = this.plugin.settings.defaultDslPath;
    if (!path) {
      this.root.render(React.createElement(PreviewPanel, { error: 'No DSL path configured' }));
      return;
    }

    try {
      const dslContent = await readDslFile(this.app.vault, path);
      const parseResult = parseDsl(dslContent);
      if ('error' in parseResult) {
        this.root.render(React.createElement(PreviewPanel, { error: parseResult.error }));
        return;
      }

      this.root.render(
        React.createElement(PreviewPanel, {
          dslContent: JSON.stringify(parseResult.dsl, null, 2),
        })
      );
    } catch (error) {
      this.root.render(React.createElement(PreviewPanel, { error: String(error) }));
    }
  }
}
