import { baseApi } from "@/redux/api/baseApi";

const bloodPostApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBloodPosts: builder.query({
      query: () => {
        const request = {
          url: "/blood-posts",
          method: "GET",
        };

        return request;
      },
    }),

    createBloodPost: builder.mutation({
      query: (postData) => {
        return {
          url: "blood-posts/create-post",
          method: "POST",
          body: postData,
        };
      },
    }),

    addPostHistory: builder.mutation({
      query: ({ id, info }) => {
        return {
          url: `/blood-posts/create-donation-history/${id}`,
          method: "PATCH",
          body: info,
        };
      },
    }),

    addPostCancelHistory: builder.mutation({
      query: ({ id, info }) => {
        return {
          url: `/blood-posts/create-donation-cancel-history/${id}`,
          method: "PATCH",
          body: info,
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
    }),

    updatePostStatus: builder.mutation({
      query: ({ id, status }) => {
        return {
          url: `/blood-posts/update-post-status/${id}`,
          method: "PATCH",
          body: status,
        };
      },
    }),

    singlePost: builder.query({
      query: (id) => {
        return {
          url: `/blood-posts/single-post/${id}`,
          method: "GET",
        };
      },
    }),

    cancelRequestedDonor: builder.mutation({
      query: ({ postId, donorId }) => {
        return {
          url: `/blood-posts/cancel-requested-donor/${postId}`,
          method: "PATCH",
          body: { donorId },
        };
      },
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
  useCancelRequestedDonorMutation,
  useDueRequestedDonorMutation,
  useDonatedRequestedDonorMutation,
} = bloodPostApi;
