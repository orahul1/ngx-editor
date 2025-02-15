import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';

import { MenuOptions } from '../types';

import { renderMenu } from './menu';

class MenuBarView {
  options: MenuOptions;
  view: EditorView;

  updateMenuItems?: (state: EditorState) => void;

  constructor(editorView: EditorView, options: MenuOptions) {
    this.view = editorView;
    this.options = options;

    this.render();
    this.update();
  }

  render(): void {
    const menuDom = document.createElement('div');
    menuDom.className = 'NgxEditor__MenuBar';

    const { update } = renderMenu(this.options, this.view, menuDom);
    this.updateMenuItems = update;

    this.view.dom.parentNode?.insertBefore(menuDom, this.view.dom);
  }

  update(): void {
    this.updateMenuItems?.(this.view.state);
  }
}

export default MenuBarView;
