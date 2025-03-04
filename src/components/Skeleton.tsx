import React from "react";

const Skeleton = () => {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-y-4">
      <h1>Loading...</h1>
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
    </div>
  );
};

export default Skeleton;
