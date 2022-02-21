import React, { useEffect, useRef } from 'react';

export default function useInterval(callback: () => void, delay: number) {
  // 【mutable】定义一个状态，更新状态不会引起组件更新
  //  savedCallback 不会跟随界面重新渲染而重置
  const savedCallback = useRef<() => void>()

  // 【watch】任意state更新都会触发
  //  每次更新 callback, 保证cb内部引用的state最新
  useEffect(() => {
    savedCallback.current = callback;
  })

  // 【created or mounted】
  //  只执行一次, 注册interval callback
  useEffect(() => {
    function tick() {
      savedCallback.current && savedCallback.current()
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      // 组件卸载时执行此回调，清除定时器
      return () => {
        clearInterval(id)
      }
    }
  }, [])
}