import { baseApi } from "@/redux/api/baseApi";

const donarRequest = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendRequest: builder.mutation({
      query: (body) => ({
        url: "/request/send-request",
        method: "POST",
        body,
      }),
    }),

    receivedRequest: builder.query({
      query: (id) => {
        console.log(id);
        return {
          url: `/request/received-request?userId=${id}`,
          method: "GET",
        };
      },
    }),

    statusAccepted: builder.mutation({
      query: (id) => {
        console.log(id);
        return {
          url: `/request/status-accepted?requestId=${id}`,
          method: "PATCH",
        };
      },
    }),

    statusRejected: builder.mutation({
      query: (id) => {
        console.log(id);
        return {
          url: `/request/status-accepted?requestId=${id}`,
          method: "PATCH",
        };
      },
    }),
  }),
});

export const {
  useSendRequestMutation,
  useReceivedRequestQuery,
  useStatusAcceptedMutation,
  useStatusRejectedMutation,
} = donarRequest;
