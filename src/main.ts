import { Plugin, WorkspaceLeaf } from 'obsidian';
import { TextUIPreviewView, VIEW_TYPE_TEXTUI } from './preview-view';

export default class TextUIDesignerPlugin extends Plugin {
  async onload() {
    this.registerView(VIEW_TYPE_TEXTUI, (leaf) => new TextUIPreviewView(leaf));
    this.addCommand({
      id: 'open-textui-preview',
      name: 'Open TextUI Preview',
      callback: () => this.activateView(),
    });
    this.addRibbonIcon('layout', 'TextUI Preview', () => this.activateView());
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_TEXTUI);
  }

  private async activateView(): Promise<void> {
    const { workspace } = this.app;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_TEXTUI);
    let leaf: WorkspaceLeaf | null = leaves.length > 0
      ? leaves[0]
      : workspace.getRightLeaf(false);
    if (leaf && leaves.length === 0) {
      await leaf.setViewState({ type: VIEW_TYPE_TEXTUI, active: true });
    }
    if (leaf) { workspace.revealLeaf(leaf); }
  }
}
