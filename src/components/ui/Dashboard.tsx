"use client";

import { useGetBloodPostsQuery } from "@/redux/features/bloodPost/bloodPostApi";
import withAuth from "../../utils/withAuth.js";
import { VictoryPie, VictoryTheme } from "victory";
import { IBloodPost, IBloodPostRequest } from "@/types/userTypes.js";
import Link from "next/link.js";
import { useGetMyDonationHistoryQuery } from "@/redux/features/auth/userAuth";

const Dashboard = () => {
  const { data } = useGetBloodPostsQuery("");
  console.log(data?.data);
  const { data: donationHistory } = useGetMyDonationHistoryQuery("");
  const donatedPost = donationHistory?.data?.donationHistory?.map(
    (item: Partial<IBloodPostRequest>) => {
      const a = item?.post?.status === "donated";
      if (a) return a;
    }
  );

  let donatedNumbers: number = 0;
  for (const item of donatedPost) {
    if (item) donatedNumbers++;
  }

  const donated = data?.data?.filter(
    (d: IBloodPost) => d.status === "donated"
  ).length;

  const pending = data?.data?.filter(
    (d: IBloodPost) => d.status === "pending"
  ).length;

  const cancelled = data?.data?.filter(
    (d: IBloodPost) => d.status === "cancelled"
  ).length;

  const APlus = data?.data?.filter(
    (d: IBloodPost) => d.bloodGroup === "A+"
  ).length;

  const AMinus = data?.data?.filter(
    (d: IBloodPost) => d.bloodGroup === "A-"
  ).length;

  const BPlus = data?.data?.filter(
    (d: IBloodPost) => d.bloodGroup === "B+"
  ).length;

  const BMinus = data?.data?.filter(
    (d: IBloodPost) => d.bloodGroup === "B-"
  ).length;
  const ABPlus = data?.data?.filter(
    (d: IBloodPost) => d.bloodGroup === "AB+"
  ).length;

  const ABMinus = data?.data?.filter(
    (d: IBloodPost) => d.bloodGroup === "AB-"
  ).length;
  const OPlus = data?.data?.filter(
    (d: IBloodPost) => d.bloodGroup === "O+"
  ).length;

  const OMinus = data?.data?.filter(
    (d: IBloodPost) => d.bloodGroup === "O-"
  ).length;

  console.log(donated, pending, cancelled);

  return (
    <div className="my-10">
      <div className="flex justify-between">
        <div>
          <p className="text-3xl font-semibold text-stone-400">
            Total blood posts:{" "}
            <span className="text-[tomato]">{data?.data?.length}</span>
          </p>
          <p className="text-3xl my-3 font-semibold text-stone-400">
            My Total Donation:{" "}
            <span className="text-[tomato]">{donatedNumbers}</span>
          </p>
        </div>
        <div>
          <button className="bg-[tomato] text-white px-10 py-4 rounded tracking-wide">
            <Link href="/createPost">Add Post</Link>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <p className="text-center text-stone-400 pt-10 text-2xl font-medium">
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
        <div>
          <p className="text-center text-stone-400 pt-10 text-2xl font-medium">
            Ratio of all posted blood groups
          </p>
          <VictoryPie
            data={[
              { x: "A+", y: APlus },
              { x: "A-", y: AMinus },
              { x: "B+", y: BPlus },
              { x: "B-", y: BMinus },
              { x: "AB+", y: ABPlus },
              { x: "AB-", y: ABMinus },
              { x: "O+", y: OPlus },
              { x: "O-", y: OMinus },
            ]}
            theme={VictoryTheme.clean}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
