'use client';

import { motion, Variants } from "framer-motion";
import Backdrop from "./backdrop";
import { useEffect } from "react";
import useWindowDimensions from "@libs/client/window";

const dropIn = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
			ease: [0, 0.71, 0.2, 1.01]
    },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
  },
};

const dropFromLeft = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
			ease: [0, 0.71, 0.2, 1.01]
    },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
  },
};

const dropFromRight = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
			ease: [0, 0.71, 0.2, 1.01]
    },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
  },
};

const dropFromBottom = {
  hidden: {
    opacity: 0,
    y: '100%',
  },
  visible: {
    opacity: 1,
    y: '0',
    transition: {
      duration: 0.3,
			ease: [0.22, 1, 0.36, 1]
    },
  },
  exit: {
    opacity: 0,
    y: '100%',
  },
};

function Modal({ handleClose, children, backdropType = 'black', modalType = 'modal', scroll=false }:{ handleClose?:()=>void, children:any, backdropType?:'black' | 'transparent', modalType?:'modal' | 'left' | 'right', scroll?:boolean }) {

  const { width } = useWindowDimensions();

  var animationVariants:Variants = dropIn;
  if(modalType === 'left') {
    animationVariants = dropFromLeft;
  }
  if(modalType === 'right') {
    animationVariants = dropFromRight;
  }
  if(width < 768) {
    animationVariants = dropFromBottom;
    modalType = 'modal';
  }

  useEffect(() => {
    const handleKeyDown = (e:KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose && handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Backdrop onClick={handleClose} backdropType={backdropType}>
			<motion.div
				className="relative w-full h-full right-0 left-0 bottom-0 top-0 flex justify-center items-center"
				variants={animationVariants}
				initial="hidden"
				animate="visible"
				exit="exit"
			>
				{ (modalType === 'modal') ? <div onClick={(e) => e.stopPropagation()} className="absolute z-40 left-0 right-0 md:right-auto bottom-0 md:top-1/2 md:left-1/2 md:bottom-auto md:!-translate-x-1/2 md:!-translate-y-1/2 origin-center bg-white rounded-t-2xl md:rounded-2xl border-[1px] border-lightgray-100 pl-5 pr-2 py-2">
          { scroll ? <div className="overflow-auto custom-scroll py-3 pr-3">
            {children}
          </div> : <div className="py-3 pr-3">
            {children}
          </div> }
				</div> : (modalType === 'left') ? <div onClick={(e) => e.stopPropagation()} className="absolute top-0 left-[440px] bottom-auto origin-center bg-white rounded-2xl border-[1px] border-lightgray-100 pl-5 pr-2 py-2">
          { scroll ? <div className="overflow-auto custom-scroll py-3 pr-3">
            {children}
          </div> : <div className="py-3 pr-3">
            {children}
          </div> }
				</div> : (modalType === 'right') ? <div onClick={(e) => e.stopPropagation()} className="absolute top-0 bottom-auto origin-center bg-white rounded-2xl border-[1px] border-lightgray-100 pl-5 pr-2 py-2">
          { scroll ? <div className="overflow-auto custom-scroll py-3 pr-3">
            {children}
          </div> : <div className="py-3 pr-3">
            {children}
          </div> }
				</div> : <div onClick={(e) => e.stopPropagation()}>
          {children}
        </div> }
			</motion.div>
    </Backdrop>
  );
};

export default Modal;