import { EditorState } from 'prosemirror-state';
import { NodeType, ResolvedPos } from 'prosemirror-model';

const findNodeType = (type: NodeType, $from: ResolvedPos): NodeType | null => {
  for (let i = $from.depth; i > 0; i--) {
    if ($from.node(i).type === type) {
      return $from.node(i).type;
    }
  }

  return null;
};

export const isNodeActive = (state: EditorState, type: NodeType, attrs = {}): boolean => {
  const { $from, to } = state.selection;

  const node: NodeType | null = findNodeType(type, $from);

  if (!Object.entries(attrs).length || !node) {
    return !!node;
  }

  return to <= $from.end() && $from.parent.hasMarkup(type, attrs);
};

export default isNodeActive;
