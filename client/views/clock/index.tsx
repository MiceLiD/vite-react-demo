import React, { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'
import useInterval from '../../hooks/useInterver'

function calcTimeStrWithTimeZone(timeZone: number) {
  const now = new Date()
  const curTimeZone = now.getTimezoneOffset() / 60
  const utcTimestamp = now.getTime() + curTimeZone * 60 * 60 * 1000
  const curZoneDate = new Date(utcTimestamp + timeZone * 60 * 60 * 1000)
  return format(curZoneDate, 'yyyy-MM-dd HH:mm:ss')
}

export default function Clock() {
  const [clocks, setClocks] = useState([] as Array<{ city: string; timeStr: string, timeZone: number }>)
  const initListPosition = { left: '0px', top: '0px', display: 'none' }
  const [listPosition, setListPosition] = useState(initListPosition)
  const cityList = [
    { city: '北京', timeZone: 8 },
    { city: '东京', timeZone: 9 },
    { city: '纽约', timeZone: -4 },
    { city: '伦敦', timeZone: 1 },
    { city: '巴黎', timeZone: 2 },
    { city: '迪拜', timeZone: 4 }
  ]
  useInterval(() => {
    const newClocks = clocks.map((ck, index) => {
      const timeStr = calcTimeStrWithTimeZone(ck.timeZone)
      return {
        ...ck,
        timeStr
      }
    })
    setClocks(newClocks)
  }, 1000)

  useEffect(() => {
    document.body.onclick = (e) => {
      setListPosition(initListPosition)
    }
  }, [])
  
  return (
    <div className='grid grid-cols-3 gap-3'>
      {
        clocks.map((ck, idx) => (
          <div key={idx} className='group relative text-center h-40 rounded-md text-white bg-fuchsia-500 flex items-center justify-center'>
            <div>
              <p>{ ck.city }</p>
              <p>{ ck.timeStr }</p>
            </div>
            <div
              className='absolute right-2 top-2 hidden group-hover:block rotate-45 cursor-pointer hover:scale-150'
              onClick={() => {
                setClocks([
                  ...clocks.slice(0, idx),
                  ...clocks.slice(idx + 1)
                ])                
              }}>
                +
              </div>
          </div>
        ))
      }
      <div
        className='text-center h-40 rounded-md text-black border-2 hover:border-fuchsia-500 transition-all duration-300 hover:text-fuchsia-500 flex items-center justify-center cursor-pointer'
        onClick={(e: any) => {
          e.stopPropagation()
          setListPosition({
            left: `${e.pageX}px`,
            top: `${e.pageY}px`,
            display: 'block'
          })
        }}
        >
        <p>+</p>
        <div className='fixed shadow-lg border-2 bg-white text-left rounded-md p-2 text-black' style={ listPosition }>
          <ul>
            {
              cityList.map((item, index) => (
                <li
                  className='bg-white hover:bg-fuchsia-500 hover:text-white px-2 transition-all duration-300'
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setListPosition(initListPosition)
                    const timeStr = calcTimeStrWithTimeZone(item.timeZone)
                    setClocks([
                      ...clocks,
                      {
                        city: item.city,
                        timeZone: item.timeZone,
                        timeStr
                      }
                    ])
                  }}>
                  { item.city } UTC{item.timeZone}
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  )
}