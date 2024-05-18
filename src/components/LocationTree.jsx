import { IoCloseCircleOutline, IoSearch } from "react-icons/io5";
import Location from "./Location";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MdOutlineClose } from "react-icons/md";
import { ImSpinner3 } from "react-icons/im";

const LocationTree = () => {
    const [data, setData] = useState(null);
    const [allData, setAllData] = useState([]);
    const [visible, setVisible] = useState(10);
    const [isData, setIsData] = useState(true);
    const [dragItem, setDragItem] = useState(null);
    const [selectLoc, setSelectLoc] = useState(null);
    const [input, setInput] = useState('');

    const containerRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get("https://66433cbc3c01a059ea221251.mockapi.io/api/locationtree/location");
            setAllData(res.data);
            setData(res.data.slice(0, 10));
            setIsData(false);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
                if (visible <= allData.length + 1 && scrollTop + clientHeight >= scrollHeight - 5) {
                    LoadMore();
                }
            }
        };

        containerRef.current.addEventListener('scroll', handleScroll);
        return () => {
            containerRef.current.removeEventListener('scroll', handleScroll);
        };
    }, [allData, visible]);

    useEffect(() => {
        const filterLocations = (allData, input) => {
            return allData.reduce((locations, loc) => {
                if (loc.label.toLowerCase().includes(input.toLowerCase())) {
                    locations.push(loc);
                } else if (loc.is_area && loc.locations.length > 0) {
                    const filteredChildren = filterLocations(loc.locations, input);
                    if (filteredChildren.length > 0) {
                        locations.push({ ...loc, locations: filteredChildren });
                    }
                }
                return locations;
            }, []);
        };

        setData(filterLocations(allData, input));
    }, [input]);

    const handleClickClose = () => {
        setInput('')
    }

    const LoadMore = () => {
        setData(allData.slice(0, visible));
        setVisible(visible + 2);
    };

    useEffect(() => {
        setData(allData.slice(0, visible));
    }, [allData]);

    const handleDragStart = (item) => {
        setDragItem(item);
    };

    const handleDropItem = (item) => {
        if (item.id !== dragItem.id)
            setAllData(moveItem(allData, dragItem, item));
        setSelectLoc(dragItem)
        setDragItem(null);

    };

    const moveItem = (locations, dragItem, item) => {
        const removeItem = (locations, dragItem) => {
            let newLocations = [];

            locations.map((location) => {
                if (location.id == dragItem.id)
                    return;
                if (location.is_area) {
                    location.locations = removeItem(location.locations, dragItem);
                }
                newLocations.push(location);
            });

            return newLocations;
        };

        const addItem = (locations, dragItem, item) => {
            let newLocations = [];

            locations.map((location) => {
                if (location.id == item.id && item.is_area) {
                    location.locations.splice(0, 0, dragItem)
                } else
                    if (location.id == item.id && !item.is_area) {
                        newLocations.push(dragItem)
                    } else
                        if (location.id != item.id && location.is_area) {
                            location.locations = addItem(location.locations, dragItem, item);
                        }
                newLocations.push(location);
            });
            return newLocations;
        };

        const newAllData = removeItem(locations, dragItem);
        return addItem(newAllData, dragItem, item);
    };

    const handleClickLocation = (location) => {
        setSelectLoc(location);
    };

    const handleOnChangeSearch = (e) => {
        setInput(e.target.value);
    };

    return (
        <div className="min-w-[350px] border rounded-md flex flex-col shadow-2xl bg-white relative">
            <div className="w-full flex justify-center p-4 bg-[#f2f2f2] items-center relative">
                <IoSearch className="absolute left-5 size-4 text-[#c6c4c4] hover:text-[#b3b3b3] cursor-pointer" />
                <input type="text" value={input} className="w-full border pl-6 h-8 outline-[#c6c4c4]" onChange={handleOnChangeSearch} />
                <MdOutlineClose className="absolute right-5 font-semibold text-[16px] text-[#c6c4c4] hover:text-[#b3b3b3] cursor-pointer" onClick={handleClickClose} />
            </div>
            <div ref={containerRef} className=" h-[300px]  p-4 overflow-y-scroll custom-scroll">
                {
                    isData ? <div className="flex justify-center gap-2 italic text-gray-500"><ImSpinner3 className="animate-spin size-6" /></div>
                        : data && data.map((item, index) => (
                            <Location handleDragStart={handleDragStart} handleDropItem={handleDropItem} index={index} item={item} key={index} selectLoc={selectLoc} handleClickLocation={handleClickLocation} searchTerm={input} />
                        ))
                }
            </div>
        </div>
    );
};

export default LocationTree;
