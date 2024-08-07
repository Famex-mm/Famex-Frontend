import Link from 'next/link'

export default function TabItem(props) {
    return (
        <Link href={`#${props.value }`}>
            <div
                className={
                    props.selected
                        ? "flex  items-center  rounded-[20px] whitespace-nowrap px-5 py-3 bg-[#CCCAB2] text-black hover:cursor-pointer transition"
                        : "flex items-center  rounded-[20px] whitespace-nowrap px-5 py-3 bg-gray-100 hover:cursor-pointer transition"
                }
            >
                {props.active &&
                    <span className="flex mr-1.5 h-3 w-3 relative place-content-center justify-center">
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                }

                {props.label}
            </div>
        </Link>
    );
}
