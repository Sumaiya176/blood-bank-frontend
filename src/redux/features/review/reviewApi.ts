import { baseApi } from "@/redux/api/baseApi";

const review = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (body) => ({
        url: "/review/create-review",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Review"],
    }),

    myReview: builder.query({
      query: (id) => {
        return {
          url: `/review/myReview/${id}`,
          method: "GET",
        };
      },
      providesTags: ["Review"],
    }),

    editReview: builder.mutation({
      query: ({ data, id }) => {
        console.log(data, id);
        return {
          url: `/review/updateReview/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Review"],
    }),

    allReview: builder.query({
      query: () => ({
        url: `/review`,
        method: "GET",
      }),
      providesTags: ["Review"],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useMyReviewQuery,
  useEditReviewMutation,
  useAllReviewQuery,
} = review;
