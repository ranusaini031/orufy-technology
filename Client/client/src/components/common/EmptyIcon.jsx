import { HiOutlinePlusSm } from "react-icons/hi";

const EmptyIcon = () => {
    return (
        <>
            <div className="empty-icon" >
                <div className="empty-column"></div>
                <div className="empty-column"></div>
                <div className="empty-column"></div>
                <div className="empty-plus-column">
                    <HiOutlinePlusSm />
                </div>
            </div>
        </>
    )
}
export default EmptyIcon;