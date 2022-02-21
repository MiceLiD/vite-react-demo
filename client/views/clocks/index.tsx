import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import useInterval from '../../hooks/useInterver'

function calcTimeStrWithTimeZone(timeZone: number) {
  const now = new Date()
  const curTimeZone = now.getTimezoneOffset() / 60
  const utcTimestamp = now.getTime() + curTimeZone * 60 * 60 * 1000
  const curZoneDate = new Date(utcTimestamp + timeZone * 60 * 60 * 1000)
  return format(curZoneDate, 'yyyy-MM-dd HH:mm:ss')
}

interface IClock {
  city: string
  timeStr: string
  timeZone: number
}
type TCityListItem = Omit<IClock, 'timeStr'>

const cityList: TCityListItem[] = [
  { city: '北京', timeZone: 8 },
  { city: '东京', timeZone: 9 },
  { city: '纽约', timeZone: -4 },
  { city: '伦敦', timeZone: 1 },
  { city: '巴黎', timeZone: 2 },
  { city: '迪拜', timeZone: 4 }
]

const initListPosition = { left: '0px', top: '0px', display: 'none', opacity: 0 }

export default function Clocks() {
  const [clocks, setClocks] = useState([] as IClock[])
  const [listPosition, setListPosition] = useState(initListPosition)

  // custom hook
  useInterval(() => {
    const newClocks = clocks.map((ck) => {
      const timeStr = calcTimeStrWithTimeZone(ck.timeZone)
      return {
        ...ck,
        timeStr
      }
    })
    setClocks(newClocks)
  }, 1000)

  // 【mounted】
  useEffect(() => {
    document.body.onclick = () => {
      setListPosition(initListPosition)
    }
  }, [])

  // 【methods】
  const onDelClocks = (idx: number) => {
    setClocks([
      ...clocks.slice(0, idx),
      ...clocks.slice(idx + 1)
    ])
  }
  const onAddClocks = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    setListPosition({
      left: `${e.pageX}px`,
      top: `${e.pageY}px`,
      display: 'block',
      opacity: 0
    })
    setTimeout(() => {
      setListPosition({
        left: `${e.pageX}px`,
        top: `${e.pageY}px`,
        display: 'block',
        opacity: 1
      })
    })
  }
  const onChooseCity = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, item: TCityListItem) => {
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
  }

  return (
    <div className='grid grid-cols-3 gap-3'>
      {/* clock list */}
      {
        clocks.map((ck, idx) => (
          <div key={idx} className='
            group relative text-center h-40 rounded-md text-white 
            bg-sky-500 flex items-center justify-center
          '>
            <div>
              <p>{ ck.city }</p>
              <p>{ ck.timeStr }</p>
            </div>
            <div
              className='
                absolute right-2 top-2 hidden group-hover:block rotate-45
                cursor-pointer hover:scale-150
              '
              onClick={() => onDelClocks(idx)}>
                +
              </div>
          </div>
        ))
      }
      {/* add clock */}
      <div
        className='
          text-center h-40 rounded-md text-black border-2 
          hover:border-sky-500 transition-all duration-300 
          hover:text-sky-500 flex items-center justify-center cursor-pointer
        '
        onClick={onAddClocks}
        >
        <p>+</p>
        {/* city list */}
        <div className='
            fixed shadow-lg border-2 bg-white text-left
            rounded-md p-2 text-black transition-all duration-600
          '
          style={ listPosition }>
          <ul>
            {
              cityList.map((item, index) => (
                <li
                  className='
                    bg-white hover:bg-sky-500 hover:text-white
                    px-2 transition-all duration-300
                  '
                  key={index}
                  onClick={(e) => onChooseCity(e, item)}>
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