'use client';

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRef } from 'react'
import { useAppSelector, useAppStore } from '@libs/client/redux/hooks'
import { setNotification } from '@libs/client/redux/notification'

let notificationModalStatus = false;

const dropDown = {
  hidden: {
    top: '0%',
    opacity: 0
  },
  visible: {
    top: '4%',
    opacity: 1,
    transition: {
      duration: 0.2,
			ease: [0, 0.71, 0.2, 1.01]
    }
  },
  exit: {
    opacity: 0
  }
};

export default function Notification() {
  const store = useAppStore();
  const initialized = useRef(false);
  if (!initialized.current) {
    store.dispatch(setNotification({ type: "success", text: "" }));
    initialized.current = true;
  }
  const notification = useAppSelector(state => state.notification);

  const [notificationModal, setNotificationModal] = useState<any>(false);

  useEffect(() => {
    if(notification.text !== "") {
      if(notificationModalStatus === false) {
        notificationModalStatus = true;
        setNotificationModal(true);

        setTimeout(() => {
          setNotificationModal(false);
          setTimeout(() => {
            notificationModalStatus = false;
          }, 300);
        }, 1600);
      }
    }
  }, [notification]);

  return (
    <>
      <AnimatePresence initial={false} mode="wait">
        { (notificationModal === true) && <div>
          <motion.div
            className="fixed left-1/2 -translate-x-1/2 top-0 z-50"
            variants={dropDown}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className={'bg-zinc-900 drop-shadow-2xl rounded-xl pl-5 pr-6 py-3 items-center flex space-x-3 z-[110] transition-all w-[93vw] md:w-auto'}>
              { notification.type !== "info" && <div className="w-7 h-7">
                { notification.type === "success" && <svg className="w-7 h-7 fill-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> }
                { notification.type === "warning" && <svg className="w-7 h-7 fill-orange-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg> }
                { notification.type === "error" && <svg className="w-7 h-7 fill-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg> }
                {/* { notification.type === "info" && <svg className="w-7 h-7 fill-blue-500" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path clipRule="evenodd" fillRule="evenodd" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z" />
                </svg> } */}
              </div> }
              { notification.type === "info" && <div className="w-[1px] h-1"></div> }
              <div className="text-base md:text-base text-white">{notification.text}</div>
            </div>
          </motion.div>
        </div> }
      </AnimatePresence>
    </>
  )
}