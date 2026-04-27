import { Plugin } from 'obsidian';

export default class TextUIDesignerPlugin extends Plugin {
  async onload() {
    console.log('TextUI Designer plugin loaded');
  }

  onunload() {
    console.log('TextUI Designer plugin unloaded');
  }
}
