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

    useEffect(() => {
      if (!token) {
        dispatch(setRoute({ path: pathname }));
        router.push(`/login?redirect=${pathname}`);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router, token, pathname]);

    return <Component {...props} />;
  };
};

export default withAuth;
