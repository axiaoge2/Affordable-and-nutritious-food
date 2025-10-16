// Scroll Reveal 动画配置
import type { Variant } from 'framer-motion';

// 定义 Variants 类型
type Variants = {
  [key: string]: Variant;
};

// 从下方淡入
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 60
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

// 从左侧滑入
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

// 从右侧滑入
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

// 缩放淡入
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

// 3D旋转进入
export const rotateIn: Variants = {
  hidden: {
    opacity: 0,
    rotateY: -90,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  }
};

// 弹跳进入
export const bounceIn: Variants = {
  hidden: {
    opacity: 0,
    y: -100,
    scale: 0.5
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
      duration: 0.8
    }
  }
};

// 交错容器（用于列表项）
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// 交错子项
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

// 波浪效果
export const wave: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 2, ease: 'easeInOut' },
      opacity: { duration: 0.5 }
    }
  }
};

// 页面视口配置（用于 IntersectionObserver）
export const viewport = {
  once: true,  // 只触发一次
  amount: 0.3,  // 元素30%进入视口时触发
  margin: '0px 0px -100px 0px'  // 底部预留100px
};

// 持续显示的视口配置（每次进入都触发）
export const repeatViewport = {
  once: false,
  amount: 0.3,
  margin: '0px 0px -100px 0px'
};
