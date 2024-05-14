"use client";
import ClipLoader from "react-spinners/ClipLoader";

const override = {
  display: "block",
  margin: "100px auto",
};

const Loading = ({ loading }) => {
  return (
    <ClipLoader
      color="#047857" // Tailwind CSS green-700 hex value
      loading={loading}
      cssOverride={override}
      size={150}
      aria-label="Loading Spinner"
    />
  );
};

export default Loading;
