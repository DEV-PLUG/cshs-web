'use client';

import { SWRConfig } from 'swr'

export const SWRProvider = ({ children }:any) => {
  return (
    <SWRConfig value={{
      fetcher: (resource, init) => fetch(resource, init).then(res => res.json()).then((res) => {
        if(
          res?.message === "Unauthorized" &&
          !(
            window.location.pathname.split("/")[1] === "" ||
            window.location.pathname.split("/")[1] === "login" ||
            window.location.pathname.split("/")[1] === "mobile"
          )
        ) return location.href = `/login?callbackUrl=${window.location.href}`;
        else return res;
      })
    }}>
      {children}
    </SWRConfig>
  );
};