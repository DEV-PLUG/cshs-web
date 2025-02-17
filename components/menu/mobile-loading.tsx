'use client';

import { LinearProgress } from "@node_modules/@mui/material";
import { useEffect, useState } from "react";

export default function MobileLoading() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      { loading === true && <div className="text-blue-500">
        <LinearProgress color="inherit" />
      </div> }
    </div>
  )
}