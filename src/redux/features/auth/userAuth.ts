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

    allUsers: builder.query({
      query: () => ({
        url: `/users/all-users`,
        method: "GET",
      }),
      providesTags: ["UserProfile"],
    }),

    // allUsers: builder.query({
    //   query: () => `/users/all-users`,
    // }),

    updateUser: builder.mutation({
      query: ({ id, user }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: user,
      }),
      invalidatesTags: ["UserProfile"],
    }),

    getMyPosts: builder.query({
      query: () => ({
        url: `/users/my-posts`,
        method: "GET",
      }),
      providesTags: ["MyPost"],
    }),

    getMyDonationHistory: builder.query({
      query: () => ({
        url: `/users/my-donation-history`,
        method: "GET",
      }),
    }),

    makeConnection: builder.mutation({
      query: ({ id }) => {
        return {
          url: `/users/make-connection/${id}`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["UserConnection"],
    }),

    connectedUsers: builder.query({
      query: () => ({
        url: `/users/connected-users`,
        method: "GET",
      }),
      providesTags: ["UserConnection"],
    }),
    // connectedUsers: builder.query({
    //   query: () => {(
    //       url: `/users/connected-users`,
    //       method: "GET",
    //   )},
    // }),

    pointReduction: builder.mutation({
      query: ({ postId, name, userId }) => {
        return {
          url: `/users/point-reduction/${name}`,
          method: "PATCH",
          body: { postId, userId },
        };
      },
    }),
    requestedDonor: builder.query({
      query: (id) => {
        return {
          url: `/users/requested-donor/${id}`,
          method: "GET",
        };
      },
      providesTags: ["RequestedDonor"],
    }),
  }),
});

export const {
  useRegistrationMutation,
  useLoginMutation,
  useActiveUsersQuery,
  useUpdateUserMutation,
  useGetMyPostsQuery,
  useGetMyDonationHistoryQuery,
  useAllUsersQuery,
  useMakeConnectionMutation,
  useConnectedUsersQuery,
  usePointReductionMutation,
  useRequestedDonorQuery,
} = authApi;
