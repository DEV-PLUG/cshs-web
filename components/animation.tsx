import { AnimationControls, motion } from "framer-motion";

export function OpacityAnimation({ children }:{ children:any }) {
  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0
        },
        visible: {
          opacity: 1
        }
      }}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}

export function StaggerParentAnimation({ children, controls }:{ children:any, controls?:AnimationControls }) {
  return (
    <motion.div
      animate={controls}
      variants={{
        hidden: {},
        visible: {
          transition: {
            duration: 0.2,
            ease: [0, 0.71, 0.2, 1.01],
            staggerChildren: 0.05
          }
        }
      }}
      initial="hidden"
    >
      {children}
    </motion.div>
  )
}

export function StaggerChildrenAnimation({ children }:{ children:any }) {
  return (
    <motion.div
      className="relative"
      variants={{
        hidden: {
          top: 20,
          opacity: 0,
        },
        visible: {
          opacity: 1,
          top: 0
        }
      }}
    >
      {children}
    </motion.div>
  )
}