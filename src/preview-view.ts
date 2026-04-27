import { EventRef, ItemView, TAbstractFile, WorkspaceLeaf } from 'obsidian';
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
  private modifyEventRef: EventRef | null = null;

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
    this.modifyEventRef = this.app.vault.on('modify', (file: TAbstractFile) => {
      if (file.path === this.plugin.settings.defaultDslPath) {
        void this.renderPreview();
      }
    });
  }

  async onClose(): Promise<void> {
    if (this.modifyEventRef) {
      this.app.vault.offref(this.modifyEventRef);
      this.modifyEventRef = null;
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
      this.root.render(
        React.createElement(PreviewPanel, { result: { error: 'No DSL path configured' } })
      );
      return;
    }

    try {
      const dslContent = await readDslFile(this.app.vault, path);
      const parseResult = parseDsl(dslContent);
      this.root.render(React.createElement(PreviewPanel, { result: parseResult }));
    } catch (error) {
      this.root.render(React.createElement(PreviewPanel, { result: { error: String(error) } }));
    }
  }
}
