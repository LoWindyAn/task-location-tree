import { IoCloseCircleOutline, IoSearch } from "react-icons/io5"
import Location from "./Location"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { MdOutlineClose } from "react-icons/md"

const LocationTree = () => {
    const [data, setData] = useState(null)
    const [allData, setAllData] = useState([])
    const [visible, setVisible] = useState(16)
    const [isLoadmore, setIsLoadMore] = useState(false)
    const [dragItem, setDragItem] = useState(null)

    const containerRef = useRef()

    useEffect(() => {

        const fetchData = async () => {
            const res = await (await axios.get("https://66433cbc3c01a059ea221251.mockapi.io/api/locationtree/location"))
            setAllData(res.data)
            setData(res.data.slice(0, 16))
        }

        fetchData()

    }, [])

    useEffect(() => {

        const handleScroll = () => {
            if (containerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
                if (visible <= allData.length + 1 && scrollTop + clientHeight >= scrollHeight - 5) {
                    setIsLoadMore(true)
                    LoadMore();
                }
            }
        };

        containerRef.current.addEventListener('scroll', handleScroll);
        return () => {
            containerRef.current.removeEventListener('scroll', handleScroll);
        };

    }, [data]);

    const LoadMore = () => {
        setData(allData.slice(0, visible))
        setVisible(visible + 2)
        setIsLoadMore(false)
    }

    useEffect(() => {
        setData(allData.slice(0, visible))
    }, [allData])

    const handleDragStart = (item) => {
        setDragItem(item)
    }

    const handleDropItem = (item) => {

        if (item.is_area && item.id !== dragItem.id && !item.locations.some(element => element.id === dragItem.id))
            setAllData(moveItem(allData, dragItem, item))
    }

    const moveItem = (locations, dragItem, item) => {

        const removeItem = (locations, dragItem) => {
            let newLocations = []

            locations.map((location) => {
                if (location.id == dragItem.id)
                    return
                if (location.is_area) {
                    location.locations = removeItem(location.locations, dragItem)
                }
                newLocations.push(location)
            })

            return newLocations
        }

        const addItem = (locations, dragItem, item) => {
            let newLocations = []

            locations.map((location, index) => {
                if (location.id == item.id) {
                    location.locations = [...location.locations, dragItem]
                    setDragItem(null)
                    newLocations.push(location)
                    return
                }
                if (location.is_area) {
                    location.locations = addItem(location.locations, dragItem, item)
                }
                newLocations.push(location)
            })
            return newLocations
        }

        const newAllData = removeItem(locations, dragItem)
        return addItem(newAllData, dragItem, item)
    }


    return (
        <div className="min-w-[350px]  border rounded-md flex flex-col  shadow-2xl bg-white relative">
            <div className="w-full flex justify-center p-4 bg-[#f2f2f2] items-center relative">
                <IoSearch className="absolute left-5 size-5 text-[#c6c4c4] hover:text-[#b3b3b3] cursor-pointer" />
                <input type="text" className="w-full border pl-6 h-8" />
                <MdOutlineClose className="absolute right-5 font-semibold text-[16px] text-[#c6c4c4] hover:text-[#b3b3b3] cursor-pointer" />
            </div>
            <div ref={containerRef} className="h-[400px] p-4 overflow-y-scroll">
                {
                    data ? data.map((item, index) => (
                        <Location handleDragStart={handleDragStart} handleDropItem={handleDropItem} index={index} item={item} key={index} />
                    )) : <p className="italic opacity-50">Loading ... </p>
                }
                {isLoadmore ? <div className="italic opacity-50">...</div> : ""}
            </div>
        </div>
    )
}

export default LocationTree