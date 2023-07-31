"use client";

import useKeyPress from "@/hooks/useKeyPress";
import { useState, useEffect, useRef, use } from "react";

export default function Home() {
	const initialWords = "The quick brown fox jumps over the lazy dog";
	const [leftPadding, setLeftPadding] = useState(
		new Array(20).fill(" ").join("")
	);
	const [outgoingChars, setOutgoingChars] = useState("");
	const [currentChar, setCurrentChar] = useState(initialWords.charAt(0));
	const [incomingChars, setIncomingChars] = useState(initialWords.substring(1));
	useKeyPress((key: any) => {
		//1
		let updatedOutgoingChars = outgoingChars;
		let updatedIncomingChars = incomingChars;

		//2
		if (key === currentChar) {
			//3
			if (leftPadding.length > 0) {
				setLeftPadding(leftPadding.substring(1));
			}
			//4
			updatedOutgoingChars += currentChar;
			setOutgoingChars(updatedOutgoingChars);

			//5
			setCurrentChar(incomingChars.charAt(0));

			//6
			updatedIncomingChars = incomingChars.substring(1);
			if (updatedIncomingChars.split(" ").length < 10) {
				updatedIncomingChars += " " + initialWords;
			}
			setIncomingChars(updatedIncomingChars);
		}
	});
	return (
		<p className="Character">
			<span className="text-slate-500">
				{(leftPadding + outgoingChars).slice(-20)}
			</span>
			<span className="text-green-500">{currentChar}</span>
			<span>{incomingChars.substring(0, 20)}</span>
		</p>
	);
}
