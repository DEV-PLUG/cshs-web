import { CircularProgress } from "@mui/material";

export default function Loading({ size = 100 }:{ size?: number }) {
  // You can add any UI inside Loading, including a Skeleton.
  return <>
    <CircularProgress color="inherit" size={size} />
  </>
}