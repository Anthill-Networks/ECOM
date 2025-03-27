import React from "react";
import * as XLSX from "xlsx";

const ExportToExcel = ({ data, fileName }) => {
  const handleExport = () => {
    const formattedData = data.map((item) => {
      const newItem = { ...item };

      // Flatten array fields into readable format (comma-separated or object keys/values)
      Object.keys(newItem).forEach((key) => {
        if (Array.isArray(newItem[key])) {
          newItem[key] = newItem[key].map((value) => {
            if (typeof value === 'object') {
              // If the value is an object, convert it to a JSON string
              return JSON.stringify(value);
            }
            return value;
          }).join(", ");
        } else if (typeof newItem[key] === 'object') {
          // If the field itself is an object, convert it to a JSON string
          newItem[key] = JSON.stringify(newItem[key]);
        }
      });

      return newItem;
    });

    // Create a worksheet from the formatted data
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook to Excel
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <button
    onClick={handleExport}
    className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
  >
      Export to Excel
    </button>
  );
};

export default ExportToExcel;
