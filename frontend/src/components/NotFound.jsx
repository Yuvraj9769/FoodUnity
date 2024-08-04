import React from "react";
import { BiSolidErrorAlt } from "react-icons/bi";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center gap-6">
      <h1 className="text-black dark:text-slate-50 text-4xl sm:text-5xl font-bold text-center">
        Sorry 404 Page Not Found
      </h1>
      <p className="text-black dark:text-slate-50 text-3xl sm:text-5xl">
        <BiSolidErrorAlt />
      </p>
    </div>
  );
};

export default NotFound;
