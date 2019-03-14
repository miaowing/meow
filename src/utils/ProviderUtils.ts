export function components(...components: any[]) {
  const results = [];
  components.forEach(component => {
    if (typeof component === 'function') {
      results.push(component);
    } else if (!!(typeof component === 'object' && component.provide)) {
      results.push(component);
    } else if (typeof component === 'object') {
      for (const key in component) {
        if (!component.hasOwnProperty(key)) {
          continue;
        }
        results.push(component[key]);
      }
    }
  });
  return results;
}
