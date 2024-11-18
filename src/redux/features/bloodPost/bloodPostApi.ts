import { baseApi } from "@/redux/api/baseApi";

const bloodPostApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBloodPosts: builder.query({
      query: () => {
        const request = {
          url: "/blood-posts",
          method: "GET",
        };
        //console.log("Request URL:", baseApi, request.url);
        return request;
      },
    }),

    createBloodPost: builder.mutation({
      query: (postData) => {
        console.log("rtk", postData);
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
  }),
});

export const {
  useGetBloodPostsQuery,
  useAddPostHistoryMutation,
  useCreateBloodPostMutation,
  useAddPostCancelHistoryMutation,
} = bloodPostApi;
