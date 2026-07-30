import { Category } from '../types';

export interface CategoryTreeItem {
  category: Category;
  depth: number;
}

export const orderCategories = (categories: Category[]): CategoryTreeItem[] => {
  const childrenByParent = new Map<number | null, Category[]>();
  const categoryIds = new Set(categories.map(category => category.id));

  categories.forEach(category => {
    const parentId = category.parentId && categoryIds.has(category.parentId)
      ? category.parentId
      : null;
    const children = childrenByParent.get(parentId) ?? [];
    childrenByParent.set(parentId, [...children, category]);
  });

  const ordered: CategoryTreeItem[] = [];
  const visited = new Set<number>();

  const appendChildren = (parentId: number | null, depth: number) => {
    const children = [...(childrenByParent.get(parentId) ?? [])]
      .sort((a, b) => a.name.localeCompare(b.name, 'sr'));

    children.forEach(category => {
      if (visited.has(category.id)) return;
      visited.add(category.id);
      ordered.push({ category, depth });
      appendChildren(category.id, depth + 1);
    });
  };

  appendChildren(null, 0);
  categories.forEach(category => {
    if (!visited.has(category.id)) ordered.push({ category, depth: 0 });
  });

  return ordered;
};

export const getDescendantIds = (categories: Category[], categoryId: number): Set<number> => {
  const descendants = new Set<number>();
  let addedDescendant = true;

  while (addedDescendant) {
    addedDescendant = false;
    categories.forEach(category => {
      if (
        category.parentId !== null
        && (category.parentId === categoryId || descendants.has(category.parentId))
        && !descendants.has(category.id)
      ) {
        descendants.add(category.id);
        addedDescendant = true;
      }
    });
  }

  return descendants;
};
