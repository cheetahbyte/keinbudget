export type Category = {
  id: number;
  name: string;
  icon: string;
};

export type CreateCategoryInput = {
  name: string;
  icon: string;
};

export type RemoveCategoryInput = {
  id: number;
};
