import { Drawer } from "@/src/ui/components/Drawer";
import useWorkoutSession from "../hooks/useWorkoutSession";
import ElementIntro from "./session_elements/ElementIntro";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SessionElement from "./session_elements/SessionElement";
import { useEffect, useRef, useState } from "react";
import Workout from "@/src/workout/components/Workout";
import useIdToken from "@/src/auth/hooks/useIdToken";
import useWorkout from "@/src/workout/hooks/management/useWorkout";
import Image from "next/image";
import List from "./session_list/List";
import formatExpectedRemainingWorkoutDuration from "@/src/workout/utils/formatExpectedRemainingWorkoutDuration";
import { Howl } from "howler";
import SoundFiles from "@/src/enums/sounds";

const url = `${process.env.NEXT_PUBLIC_BACKEND_API}api/workout_session`;

let workoutCompleteSound = undefined;

/**
 * This function is used to play the audio when the workout is finished
 */
const finishWorkoutAudioHandler = () => {
  if (!workoutCompleteSound) {
    workoutCompleteSound = new Howl({
      src: [`/sounds/${SoundFiles.WORKOUT_COMPLETE}`],
      volume: 0.7,
    });
  }

  workoutCompleteSound.play();
};

const WorkoutSession = ({ children }) => {
  const workoutSession = useWorkoutSession();
  const seenIntrosRef = useRef([]);
  const idToken = useIdToken();
  const workout = useWorkout();
  const [currentScreen, setCurrentScreen] = useState("session");

  const current = workoutSession.current;

  const currentExercise =
    current.elementIndex == -1
      ? null
      : workoutSession.elements[current.elementIndex].exercise;

  const introMessage =
    currentExercise !== null ? (
      <div className=" flex flex-col items-center gap-3">
        <h3 className=" font-bold text-2xl">Your next exercise is:</h3>
        <h2 className=" font-bold text-3xl">{`${currentExercise.name}`}</h2>
        <Image
          src={currentExercise.imageURL}
          alt="exericse"
          width={300}
          height={300}
          priority={true}
          loading="eager"
        />
      </div>
    ) : null;

  const totalExercises = workoutSession.elements.length;
  const currentElementIndex = workoutSession.current.elementIndex + 1;

  const finishWorkoutCalendar = async (workout) => {
    //workout.elements
    console.log("WORKOUT OBJECT", workout);
  };

  const finishWorkoutHandler = async () => {
    console.log("FINISHING WORKOUT");
    finishWorkoutCalendar(workoutSession);
    const workoutID = workout.id;
    console.log(workoutID);
    try {
      finishWorkoutAudioHandler();
      const res = await fetch(url, {
        headers: new Headers({
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        }),
        method: "POST",
        body: JSON.stringify({ ...workoutSession, workoutID }),
      });

      console.log(res);

      const json = await res.json();

      console.log(json);
    } catch (err) {
      console.log("Failed to complete workout", err);
    }
  };

  const hasAlreadySeenElement = seenIntrosRef.current.includes(
    current.elementIndex
  );

  useEffect(() => {
    if (!hasAlreadySeenElement) {
      seenIntrosRef.current.push(current.elementIndex);
    }
  }, [current.elementIndex]);

  const sessionElem = (
    <SessionElement
      key={current.elementIndex}
      element={workoutSession.elements[current.elementIndex]}
    />
  );

  const listToggler = () => {
    const newValue = currentScreen === "session" ? "list" : "session";
    setCurrentScreen(newValue);
  };

  let content;

  if (current.elementIndex === -1 || current.componentIndex === -1) {
    content = null;
  } else if (currentScreen === "session") {
    content = hasAlreadySeenElement ? (
      sessionElem
    ) : (
      <ElementIntro message={introMessage}>{sessionElem}</ElementIntro>
    );
  } else {
    content = <List openSessionScreen={listToggler} />;
  }

  const togglerText =
    currentScreen === "session" ? "View Workout" : "Back to current exercise";

  return (
    <Drawer
      fullScreen={true}
      trigger={<div>{children}</div>}
      content={<div key={current.elementIndex}>{content}</div>}
      title={
        <div className=" w-full p-3">
          <div className=" flex justify-between items-center w-full">
            <div className=" flex gap-4 items-center">
              <Button variant="secondary" onClick={listToggler}>
                {togglerText}
              </Button>
              <div className="flex flex-col">
                <h3 className="font-bold">
                  {formatExpectedRemainingWorkoutDuration(
                    workoutSession.expectedRemainingSeconds
                  )}
                </h3>
                <h3>
                  Your progress: {currentElementIndex}/{totalExercises}
                </h3>
              </div>
            </div>
            <Button onClick={finishWorkoutHandler}>Finish Workout</Button>
          </div>
          <Separator className="mt-3" />
        </div>
      }
    />
  );
};

export default WorkoutSession;
