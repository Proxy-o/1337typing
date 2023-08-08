import { cn } from "@/lib/utils";
import React from "react";

function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"w-56 h-8 bg-gray-500 animate-pulse rounded-lg flex justify-center items-center text-secondary mr-2",
				className
			)}
		/>
	);
}

export default Skeleton;
