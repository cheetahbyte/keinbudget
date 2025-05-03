import type { ReactNode } from "react";
import { ApiClient } from "../api";
import { UserService, UserServiceContext } from "./user.service";
import { useToken } from "../hooks";
import { apiClientWithToken } from "../utils";

interface UserServiceProviderProps {
  children: ReactNode;
}

export const UserServiceProvider: React.FC<UserServiceProviderProps> = ({
  children,
}) => {
  const token = useToken();

  if (!token) return null;

  const apiClient = new ApiClient();
  const userService = new UserService(apiClientWithToken(apiClient, token));

  return (
    <UserServiceContext.Provider value={{ userService }}>
      {children}
    </UserServiceContext.Provider>
  );
};
