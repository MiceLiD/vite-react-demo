import React, { useRef } from 'react'

export default function Home() {
  const count = useRef<number>(0)
  return (
    <>
      <div>{count.current}</div>
      <button onClick={() => { count.current += 1; console.log(count) }}>click</button>
    </>
  )
}