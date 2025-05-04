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

  if (token === undefined) {
    return null;
  }

  if (!token) {
    return (
      <UserServiceContext.Provider value={undefined}>
        {children}
      </UserServiceContext.Provider>
    );
  }

  const apiClient = new ApiClient();
  const userService = new UserService(apiClientWithToken(apiClient, token));

  return (
    <UserServiceContext.Provider value={{ userService }}>
      {children}
    </UserServiceContext.Provider>
  );
};
