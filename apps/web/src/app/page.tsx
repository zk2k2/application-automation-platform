// src/app/page.tsx
import { Button } from "@/components/ui/button";
import { FC } from "react";

const HomePage: FC = () => {
  const userName = "John"; // you can fetch this from your auth/session

  return (
    <main className="h-screen flex  items-center justify-center bg-gray-50 p-4">
      <div className="max-w-xl w-full flex flex-col py-32  !h-4/5  rounded-2xl bg-transparent  p-8 space-y-10">
        <h1 className="text-[4rem] leading-[1.25] text-center font-lg text-gray-800 animate-fade-in">
          {" "}
          <span className="font-light">Welcome,</span> {userName}
        </h1>
        <div className="flex justify-around">
          <Button asChild className="animate-slide-in-left delay-500">
            <div className="!p-7">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
              <p className=" text-center font-light text-lg">Create a resume</p>
            </div>
          </Button>
          <Button
            variant="outline"
            asChild
            className="animate-slide-in-left delay-500"
          >
            <div className="!p-7">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
              <p className=" text-center font-light text-lg">Start applying</p>
            </div>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
