const isNode = (event: EventTarget | null): event is Node | null => {
  if (!event || 'nodeType' in event) {
    return true;
  }

  return false;
};

export default isNode;
