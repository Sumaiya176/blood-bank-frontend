"use client";

import { useGetBloodPostsQuery } from "@/redux/features/bloodPost/bloodPostApi";
import withAuth from "../../utils/withAuth.js";
import { VictoryPie, VictoryTheme } from "victory";

const Dashboard = () => {
  const { data } = useGetBloodPostsQuery("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const donated = data?.data?.filter((d: any) => d.status === "donated").length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pending = data?.data?.filter((d: any) => d.status === "pending").length;

  const cancelled = data?.data?.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (d: any) => d.status === "cancel"
  ).length;

  return (
    <div>
      <p className="text-center pt-10 text-2xl font-medium">
        Ratio of total donated, cancelled and pending post
      </p>
      <VictoryPie
        data={[
          { x: "Donated", y: donated },
          { x: "Pending", y: pending },
          { x: "Cancelled", y: cancelled },
        ]}
        theme={VictoryTheme.clean}
      />
    </div>
  );
};

export default withAuth(Dashboard);
