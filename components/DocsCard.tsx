"use client";
import React from "react";
import Image from "next/image";

const DocsCard = ({
  id,
  Title,
  content,
  image,
}: {
  id: number;
  Title: string;
  content: string;
  image: string;
}) => {
  return (
    <div
      className={`w-full flex py-3 px-2 text-white ${
        id % 2 === 0 ? " justify-end " : ""
      }`}
    >
      <div
        className={`flex flex-col lg:flex-row lg:gap-10 gap-5 justify-between max-w-[850px] w-full  `}
      >
        <div className="flex flex-col max-w-[400px] w-full gap-2">
          <h2 className="text-3xl text-indigo-600 font-medium ">
            {id}. {Title}
          </h2>{" "}
          <p className="text-lg">{content}</p>{" "}
        </div>
        <div>
          <Image
            className="rounded-lg"
            alt="refImage"
            src={image}
            height={300}
            width={350}
          />
        </div>
      </div>
    </div>
  );
};

export default DocsCard;
