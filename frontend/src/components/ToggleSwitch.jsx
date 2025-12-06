import React from "react";

export default function ToggleSwitch (
    { isChecked, handleCheckboxChange }
){
  return (
    <label className='flex cursor-pointer select-none items-center'>
      <div className='relative'>
        <input
          type='checkbox'
          checked={isChecked}
          onChange={(e) => handleCheckboxChange(e.target.checked)}
          className='sr-only'
        />

        <div
          className={`block h-7 w-12 rounded-full transition
            ${isChecked ? "bg-[#94bf30d2]" : "bg-gray-300"}
          `}
        ></div>

        <div
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform
            ${isChecked ? "translate-x-6" : "translate-x-1"}
          `}
        ></div>
      </div>
    </label>
  );
};
