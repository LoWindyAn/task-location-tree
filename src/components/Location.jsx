import React, { useEffect, useState } from 'react'
import { FaRegFolderOpen } from 'react-icons/fa6';
import { IoIosFolder } from 'react-icons/io'
import { IoLocationSharp } from 'react-icons/io5'

const Location = (props) => {
  const { item, index } = props;
  const [openFolder, setOpenFolder] = useState(false)
  const changeOpen = () => {
    if (item.locations.length > 0) {
      setOpenFolder(!openFolder)
    }
  }
  return (
    <div className='flex flex-col'>
      <div className='flex items-center gap-2 cursor-pointer' onClick={changeOpen}>
        {!item.is_area ? < IoLocationSharp className='text-[#c6c4c4]' /> : openFolder ? <FaRegFolderOpen className='text-[#c6c4c4]' /> : < IoIosFolder className='text-[#c6c4c4]' />}

        <p className='text-[#5c5c5c] hover:text-[#121212] font-semibold'>{item.label}</p>
      </div>
      {
        openFolder ?
          <div className='ml-6 my-1 '>
            {item.locations.length > 0 && item.locations.map((subItem, subIndex) => (
              <Location item={subItem} index={subIndex} key={subIndex} />
            ))}
          </div> :
          ''
      }
    </div>
  )
}

export default Location