import { Node as ProsemirrorNode } from 'prosemirror-model';
import { NodeSelection, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { ImagePluginOptions } from './types';

const WRAPPER_CLASSNAME = 'NgxEditor__ImageWrapper';
const WRAPPER_RESIZE_ACTIVE_CLASSNAME = 'NgxEditor__Resizer--Active';
const RESIZE_HANDLE_CLASSNAME = 'NgxEditor__ResizeHandle';

class ImageRezieView {
  img: HTMLElement;
  dom: HTMLElement;
  handle: HTMLElement;

  constructor(node: ProsemirrorNode, view: EditorView, getPos: () => number) {
    const outer = document.createElement('span');
    outer.className = WRAPPER_CLASSNAME;
    outer.style.width = node.attrs.width;

    const img = document.createElement('img');
    img.setAttribute('src', node.attrs.src);
    img.setAttribute('alt', node.attrs.alt ?? '');
    img.setAttribute('title', node.attrs.title ?? '');
    img.style.width = '100%';

    const handle = document.createElement('span');
    handle.className = RESIZE_HANDLE_CLASSNAME;

    handle.onmousedown = (mousedownEvent) => {
      mousedownEvent.preventDefault();

      const { state, dispatch } = view;
      const { tr } = state;

      const startX = mousedownEvent.pageX;
      const startWidth = img.clientWidth;

      const { width } = window.getComputedStyle(view.dom);
      const editorWidth = parseInt(width, 10);

      const onMouseMove = (mouseMoveEvent: MouseEvent) => {
        const currentX = mouseMoveEvent.pageX;
        const diffInPx = currentX - startX;
        const computedWidth = startWidth + diffInPx;

        // prevent image overflow the editor
        // prevent resizng below 20px
        if (computedWidth > editorWidth || computedWidth < 20) {
          return;
        }

        outer.style.width = `${computedWidth}px`;
      };

      const onMouseUp = (e: MouseEvent) => {
        e.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        const transaction = tr.setNodeMarkup(getPos(), null, {
          src: node.attrs.src,
          width: outer.style.width
        });

        const resolvedPos = transaction.doc.resolve(getPos());
        const newSelection = new NodeSelection(resolvedPos);

        transaction.setSelection(newSelection);
        dispatch(transaction);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    outer.appendChild(handle);
    outer.appendChild(img);

    this.dom = outer;
    this.img = img;
    this.handle = handle;
  }

  selectNode(): void {
    this.dom.classList.add(WRAPPER_RESIZE_ACTIVE_CLASSNAME);
    this.handle.style.display = 'block';
  }

  deselectNode(): void {
    this.dom.classList.remove(WRAPPER_RESIZE_ACTIVE_CLASSNAME);
    this.handle.style.display = 'none';
  }
}

const defaultOptions: ImagePluginOptions = {
  resize: true,
};

const imagePlugin = (opts = defaultOptions): Plugin => {
  const options = { ...defaultOptions, ...opts };

  return new Plugin({
    key: new PluginKey('link'),
    props: {
      nodeViews: {
        image: (node: ProsemirrorNode, view: EditorView, getPos: () => number) => {
          if (!options.resize) {
            return null;
          }
          return new ImageRezieView(node, view, getPos);
        },
      }
    }
  });
};

export default imagePlugin;
