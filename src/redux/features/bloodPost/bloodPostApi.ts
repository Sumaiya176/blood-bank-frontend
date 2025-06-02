import { baseApi } from "@/redux/api/baseApi";

const bloodPostApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBloodPosts: builder.query({
      query: ({ page = 1, limit = 20 }) => ({
        url: `/blood-posts?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["BloodPost"],
    }),

    createBloodPost: builder.mutation({
      query: (postData) => {
        return {
          url: "blood-posts/create-post",
          method: "POST",
          body: postData,
        };
      },
      invalidatesTags: ["BloodPost", "MyPost"],
    }),

    addPostHistory: builder.mutation({
      query: ({ userId, info }) => {
        return {
          url: `/blood-posts/create-donation-history/${userId}`,
          method: "PATCH",
          body: info,
        };
      },
    }),

    addPostCancelHistory: builder.mutation({
      query: ({ userId, requestId }) => {
        console.log(requestId);
        return {
          url: `/blood-posts/create-donation-cancel-history/${userId}`,
          method: "PATCH",
          body: requestId,
        };
      },
    }),

    updateBloodPost: builder.mutation({
      query: ({ id, info }) => {
        return {
          url: `/blood-posts/${id}`,
          method: "PATCH",
          body: info,
        };
      },
    }),

    deleteBloodPost: builder.mutation({
      query: ({ id }) => {
        return {
          url: `/blood-posts/delete-blood-post/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["MyPost"],
    }),

    updatePostStatus: builder.mutation({
      query: ({ id, status }) => {
        console.log(id, status);
        return {
          url: `/blood-posts/update-post-status/${id}`,
          method: "PATCH",
          body: status,
        };
      },
      invalidatesTags: ["MyPost"],
    }),

    singlePost: builder.query({
      query: (id) => {
        return {
          url: `/blood-posts/single-post/${id}`,
          method: "GET",
        };
      },
    }),

    changeDonarRequestStatus: builder.mutation({
      query: ({ status, requestId }) => {
        return {
          url: `/request/change-request-status/${requestId}`,
          method: "PATCH",
          body: { status },
        };
      },
      invalidatesTags: ["RequestedDonor", "Request"],
    }),

    dueRequestedDonor: builder.mutation({
      query: (postId) => {
        return {
          url: `/blood-posts/due-requested-donor/${postId}`,
          method: "PATCH",
        };
      },
    }),

    donatedRequestedDonor: builder.mutation({
      query: ({ postId, userId }) => {
        return {
          url: `/blood-posts/donated-requested-donor/${postId}`,
          method: "PATCH",
          body: { userId },
        };
      },
    }),
  }),
});

export const {
  useGetBloodPostsQuery,
  useAddPostHistoryMutation,
  useCreateBloodPostMutation,
  useAddPostCancelHistoryMutation,
  useUpdateBloodPostMutation,
  useDeleteBloodPostMutation,
  useUpdatePostStatusMutation,
  useSinglePostQuery,
  useChangeDonarRequestStatusMutation,
  useDueRequestedDonorMutation,
  useDonatedRequestedDonorMutation,
} = bloodPostApi;
