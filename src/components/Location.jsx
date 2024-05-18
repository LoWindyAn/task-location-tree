import React, { useEffect, useState } from 'react';
import { IoIosFolder, IoIosFolderOpen } from 'react-icons/io';
import { IoLocationSharp } from 'react-icons/io5';

const Location = (props) => {
  const { item, index, handleDragStart, handleDropItem, handleClickLocation, selectLoc, searchTerm } = props;
  const [openFolder, setOpenFolder] = useState(false);

  useEffect(() => {
    if (searchTerm && item.label.toLowerCase().includes(searchTerm.toLowerCase())) {
      setOpenFolder(true);
    }
  }, [searchTerm, item.label]);

  const changeOpen = () => {
    handleClickLocation(item);
    if (item.locations.length > 0) {
      setOpenFolder(!openFolder);
    }
  };

  const handleOnDragStart = (e) => {
    e.stopPropagation();
    handleDragStart(item);
  };

  const handleDrop = (e) => {
    e.stopPropagation();
    handleDropItem(item);
  };

  return (
    <div className='flex flex-col mt-1'
      draggable
      onDragStart={handleOnDragStart}
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
    >
      {selectLoc && selectLoc.id === item.id
        ? (
          <div className='flex items-center gap-2 cursor-pointer' onClick={changeOpen} >
            {!item.is_area ? <IoLocationSharp className='text-[#c6c4c4] size-5' /> : openFolder ? <IoIosFolderOpen className='text-[#c6c4c4] size-5' /> : <IoIosFolder className='text-[#c6c4c4] size-5' />}
            <p className='text-[#4c73dd] font-semibold'>{item.label}</p>
          </div>
        )
        : (
          <div className='flex items-center gap-2 cursor-pointer' onClick={changeOpen} >
            {!item.is_area ? <IoLocationSharp className='text-[#c6c4c4] size-5' /> : openFolder ? <IoIosFolderOpen className='text-[#c6c4c4] size-5' /> : <IoIosFolder className='text-[#c6c4c4] size-5' />}
            <p className='text-[#5c5c5c] hover:text-[#65b5f6] font-semibold'>{item.label}</p>
          </div>
        )
      }

      {
        openFolder &&
        <div className='ml-6 my-1'>
          {item.locations.length > 0 && item.locations.map((subItem, subIndex) => (
            <Location item={subItem} index={subIndex} key={subIndex} handleDragStart={handleDragStart} handleDropItem={handleDropItem} handleClickLocation={handleClickLocation} selectLoc={selectLoc} searchTerm={searchTerm} />
          ))}
        </div>
      }
    </div>
  );
};

export default Location;
