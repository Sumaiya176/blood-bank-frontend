import { baseApi } from "@/redux/api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registration: builder.mutation({
      query: (user) => ({
        url: "/users/user-registration",
        method: "POST",
        body: user,
      }),
    }),

    login: builder.mutation({
      query: (user) => ({
        url: "/auth/login",
        method: "POST",
        body: user,
      }),
    }),

    activeUsers: builder.query({
      query: () => ({
        url: `/users/active-users`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useRegistrationMutation,
  useLoginMutation,
  useActiveUsersQuery,
} = authApi;
