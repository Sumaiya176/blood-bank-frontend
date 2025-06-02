// src/utils/withAuth.js
import { useCurrentToken } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { setRoute } from "@/redux/features/auth/authSlice";

const withAuth = (Component) => {
  return function ProtectedComponent(props) {
    const token = useAppSelector(useCurrentToken);
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    //const { updateLastSeen } = useUpdateLastSeenMutation();

    useEffect(() => {
      if (!token) {
        dispatch(setRoute({ path: pathname }));
        router.push(`/login?redirect=${pathname}`);
      }

      // const update = () => {
      //   updateLastSeen()
      //     .unwrap()
      //     .catch((err) => console.error("Last seen update failed", err));
      // };

      // update(); // call immediately
      // const intervalId = setInterval(update, 5 * 60 * 1000); // every 5 mins

      // return () => clearInterval(intervalId);
    }, [router, token, pathname, dispatch]);

    return <Component {...props} />;
  };
};

export default withAuth;
