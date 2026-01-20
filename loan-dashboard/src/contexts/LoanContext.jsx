import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const LoanContext = createContext();

export const LoanProvider = ({ children }) => {
  const [loanRecords, setLoanRecords] = useState(() => {
    try {
      const savedData = localStorage.getItem("myLoanData");
      return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("myLoanData", JSON.stringify(loanRecords));
  }, [loanRecords]);

  const getCurrentTime = () => {
    const now = new Date();
    // Format: DD/MM/YYYY
    const datePart = `${String(now.getDate()).padStart(2, "0")}/${String(
      now.getMonth() + 1,
    ).padStart(2, "0")}/${now.getFullYear()}`;
    // Format: HH:mm
    const timePart = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes(),
    ).padStart(2, "0")}`;
    const monthPart = `${String(now.getMonth() + 1).padStart(
      2,
      "0",
    )}/${now.getFullYear()}`;

    return {
      fullDateTime: `${timePart} - ${datePart}`,
      rawDate: datePart,
      rawMonth: monthPart,
    };
  };

  const addRecord = async (record) => {
    const timeInfo = getCurrentTime();

    const newRecord = {
      ...record,
      key: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: "processing",
      reason: "Đang xử lý...", // Giá trị tạm
      date: timeInfo.fullDateTime,
      rawDate: timeInfo.rawDate,
      rawMonth: timeInfo.rawMonth,
    };

    setLoanRecords((prev) => [newRecord, ...prev]);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        record,
      );

      // --- ĐÂY LÀ ĐOẠN QUAN TRỌNG ĐÃ SỬA ---
      setLoanRecords((prev) =>
        prev.map((item) =>
          item.key === newRecord.key
            ? {
                ...item,
                status: response.data.status,
                // 👇 LẤY LÝ DO TỪ BACKEND VỀ (QUAN TRỌNG NHẤT)
                reason: response.data.reason || "Không rõ lý do",
              }
            : item,
        ),
      );
      // --------------------------------------
    } catch (error) {
      console.error("Connection Error:", error);
      setLoanRecords((prev) =>
        prev.map((item) =>
          item.key === newRecord.key
            ? { ...item, status: "error", reason: "Mất kết nối Server" }
            : item,
        ),
      );
    }
  };

  const deleteRecord = (key) => {
    setLoanRecords((prev) => prev.filter((item) => item.key !== key));
  };

  const clearAllData = () => {
    setLoanRecords([]);
    localStorage.removeItem("myLoanData");
  };

  return (
    <LoanContext.Provider
      value={{ loanRecords, addRecord, deleteRecord, clearAllData }}
    >
      {children}
    </LoanContext.Provider>
  );
};
