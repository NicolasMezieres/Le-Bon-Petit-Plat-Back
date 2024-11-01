export type favoriteRecipe = {
  idRecipe: string;
};
export type userJWT = {
  id: string;
  isActive: boolean;
  email: string;
  role: {
    id: string;
    name: string;
  };
};