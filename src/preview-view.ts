import { ItemView, WorkspaceLeaf } from 'obsidian';

export const VIEW_TYPE_TEXTUI = 'textui-preview';

export class TextUIPreviewView extends ItemView {
  getViewType(): string { return VIEW_TYPE_TEXTUI; }
  getDisplayText(): string { return 'TextUI Preview'; }

  async onOpen(): Promise<void> {
    const container = this.containerEl.children[1] as HTMLElement;
    container.empty();
    container.createEl('div', { text: 'TextUI Preview — loading...' });
  }

  async onClose(): Promise<void> {}
}
