"use client";

import { validateHexColor } from "@/utils/colorValidation";

export default function ColorInput({
  label,
  value,
  onChange,
  error,
  placeholder,
  onColorChange,
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (onColorChange) {
              onColorChange(null);
            }
          }}
          className="w-16 h-10 border border-gray-300 dark:border-gray-700 rounded cursor-pointer"
          title="Select a color"
        />
        <div className="flex-1 relative">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              const newValue = e.target.value;
              onChange(newValue);
              if (onColorChange) {
                if (newValue && !validateHexColor(newValue)) {
                  onColorChange("Invalid hex code. Format: #RRGGBB or #RGB");
                } else {
                  onColorChange(null);
                }
              }
            }}
            placeholder={placeholder}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-800 ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
            }`}
            title={`Enter hex color code (e.g., ${placeholder})`}
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}

