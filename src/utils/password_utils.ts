export const hash_password = async (password: string): Promise<string> => {
  return await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10,
  });
};

export const verify_password = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await Bun.password.verify(password, hash);
};