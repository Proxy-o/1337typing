"use client";

import useKeyPress from "@/hooks/useKeyPress";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { names, texts } from "@/lib/texts";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Skeleton from "@/components/skeleton.component";
import { updatePWD } from "./actions";

// to fix the error: client render does not m
const NoSSR = dynamic(() => import("@/components/text.component"), {
	ssr: false,
});
const SECONDS = 3;

export default function Home() {
	/// the game vars starts here
	const nbr = Math.floor(Math.random() * texts.length);

	const [initialWords, setInitialWords] = useState(texts[nbr].trim());

	const wordsArr = initialWords.split(" ");

	const [word, setWord] = useState(wordsArr[0]);
	const [currentLetter, setCurrentLetter] = useState(word[0]);
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
	const [spacePressed, setSpacePressed] = useState(false);
	const [countDown, setCountDown] = useState(SECONDS);
	const [wpm, setWpm] = useState(0);
	const [accuracy, setAccuracy] = useState(0);
	const isLastLetter =
		currentWordIndex === wordsArr.length - 1 &&
		currentLetterIndex === wordsArr[wordsArr.length - 1].length;
	const [updateScore, setUpdateScore] = useState(true);

	const wordsStyling = wordsArr.map((word, word_index) => {
		return word.split("").map((letter, index) => {
			return {
				letter,
				word_index,
				index,
				style: "normal",
			};
		});
	});

	const [words, setWords] = useState(wordsStyling);
	// the game vars ends here

	// user handling starts here
	const { data: session, status }: { data: any; status: any } = useSession();

	// redirect to login page if user is not logged in
	const router = useRouter();
	/// troll the
	// check if ther is a user with name in a file and redirect to a troll page
	if (session && session.user && session.user.name) {
		const name = session.user.login;
		if (names.includes(name)) {
			router.push(
				"https://www.verywellfamily.com/how-to-play-capture-the-flag-1257384"
			);
		}
	}

	useEffect(() => {
		if ((countDown === 0 || isLastLetter) && updateScore) {
			setUpdateScore(false);
			setCountDown(0);
			// cont the number of wrong words in words
			let wrg = words.filter((word, word_index) => {
				return (
					word.filter((letter, index) => {
						if (
							word_index <= currentWordIndex &&
							(letter.style === "incorrect" || letter.style === "normal")
						) {
							return true;
						}
						return false;
					}).length > 0
				);
			}).length;

			const newWpm = Math.round(
				(currentWordIndex / (SECONDS - countDown)) * 60
			);
			setWpm(newWpm);
			let newAccuracy = Math.round(
				(((currentWordIndex + 1 - wrg) / (currentWordIndex + 1)) * 100 * 100) /
					100
			);

			setAccuracy(newAccuracy);
			if (session && session.user && newWpm > 0 && newAccuracy > 0) {
				const data = {
					id: session.user.id,
					login: session.user.login,
					wpm: newWpm,
					accuracy: newAccuracy,
					avatarUrl: session.user.image!,
					profileUrl: session.user.url,
				};
				const string = JSON.stringify(data);

				//encrypt it with the key 'key'.
				const mbencrypt = require("mb-encrypt");

				const responseEncoded = mbencrypt.encrypt(
					string,
					process.env.NEXT_PUBLIC_SECRET
				);

				updatePWD(responseEncoded);
			}
		}
	}, [
		countDown,
		currentWordIndex,
		currentLetterIndex,
		isLastLetter,
		session,
		words,
		updateScore,
		wpm,
		accuracy,
	]);

	useKeyPress((key: any) => {
		if (countDown === 0) {
			return;
		}
		// the letter entered is correct
		if (key === currentLetter) {
			if (currentWordIndex === 0 && currentLetterIndex === 0) {
				let interval = setInterval(() => {
					setCountDown((prevCountdown) => {
						if (prevCountdown === 0) {
							clearInterval(interval);
							return 0;
						} else {
							return prevCountdown - 1;
						}
					});
				}, 1000);
			}

			setSpacePressed(false);
			setCurrentLetter(word[currentLetterIndex + 1]);
			setCurrentLetterIndex(currentLetterIndex + 1);
			// set the word correct only of all word is completed

			setWords(
				words.map((word, word_index) => {
					return word.map((letter, index) => {
						if (word_index === currentWordIndex) {
							if (index === currentLetterIndex) {
								return {
									...letter,
									style: "correct",
								};
							}
						}
						return letter;
					});
				})
			);
		}

		// restart the game

		if (key === "Backspace" && currentLetterIndex > 0) {
			setSpacePressed(false);
			setWords(
				words.map((word, word_index) => {
					return word.map((letter, index) => {
						if (word_index === currentWordIndex) {
							if (index === currentLetterIndex - 1) {
								return {
									...letter,
									style: "normal",
								};
							}
						}
						return letter;
					});
				})
			);
			setCurrentLetterIndex(currentLetterIndex - 1);
			setCurrentLetter(word[currentLetterIndex - 1]);
		}

		if (key === "Backspace" && currentLetterIndex === 0) {
			setSpacePressed(false);
			setWords(
				words.map((word, word_index) => {
					return word.map((letter, index) => {
						if (word_index === currentWordIndex - 1) {
							if (index === wordsArr[currentWordIndex - 1].length - 1) {
								return {
									...letter,
									style: "normal",
								};
							}
						}
						return letter;
					});
				})
			);
			if (currentWordIndex > 0) {
				setCurrentWordIndex(currentWordIndex - 1);
				setWord(wordsArr[currentWordIndex - 1]);
				setCurrentLetterIndex(wordsArr[currentWordIndex - 1].length - 1);
				setCurrentLetter(
					wordsArr[currentWordIndex - 1][
						wordsArr[currentWordIndex - 1].length - 1
					]
				);
			}
		}

		if (
			key === " " &&
			currentWordIndex < wordsArr.length - 1 &&
			!spacePressed
		) {
			setSpacePressed(true);
			setCurrentWordIndex(currentWordIndex + 1);
			setWord(wordsArr[currentWordIndex + 1]);
			setCurrentLetterIndex(0);
			setCurrentLetter(wordsArr[currentWordIndex + 1][0]);
		} else if (key !== currentLetter && key !== "Backspace" && key !== " ") {
			if (currentLetterIndex < word.length - 1) {
				setWords(
					words.map((word, word_index) => {
						return word.map((letter, index) => {
							if (word_index === currentWordIndex) {
								if (index === currentLetterIndex) {
									return {
										...letter,
										style: "incorrect",
									};
								}
							}
							return letter;
						});
					})
				);
				setCurrentLetterIndex(currentLetterIndex + 1);
				setCurrentLetter(word[currentLetterIndex + 1]);
			}
		}
	});
	if (status === "loading") {
		return (
			<div className="w-full h-screen items-center flex justify-center  flex-col">
				<Skeleton className="h-2 w-5/6  my-2" />
				<Skeleton className="h-2 w-4/6  my-2" />
				<Skeleton className="h-2 w-5/6  my-2" />
				<Skeleton className="h-2 w-5/6  my-2" />
				<Skeleton className="h-2 w-4/6  my-2" />
				<Skeleton className="h-2 w-5/6  my-2" />
				<Skeleton className="h-2 w-5/6  my-2" />
				<Skeleton className="h-2 w-5/6  my-2" />
				<Skeleton className="h-2 w-4/6  my-2" />
				<Skeleton className="h-2 w-5/6  my-2" />
			</div>
		);
	}
	if (!session) {
		return (
			<div className="h-screen flex justify-center items-center">
				<Button variant="secondary" onClick={() => signIn()}>
					Login
				</Button>
				;
			</div>
		);
	} else {
		return (
			<NoSSR
				countDown={countDown}
				wpm={wpm}
				accuracy={accuracy}
				wordsArr={wordsArr}
				currentWordIndex={currentWordIndex}
				currentLetterIndex={currentLetterIndex}
				words={words}
			/>
		);
	}
}
