import React from 'react'

function lengthOfLIS(nums: number[]): number {
  const len = nums.length
  const dp = Array(len).fill(1)
  let max = 1
  for(let i = 1; i < len; i++) {
    // 外循环
    for (let j = 0; j < i; j++) {
      // 内循环
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1)
      }
    }
    max = Math.max(max, dp[i])
  }
  return max
}

export default function MapBox() {
  console.log(lengthOfLIS([10,9,2,5,3,7,101,18]))
  // 10,9,2,5,3,7,101,18
  // 1 ,1,1,1,1,1,1,  1
  // 1 ,1,1,2,2,3,4,  4../
  return (
    <div>
      home
    </div>
  )
}
