"use client";
import React, { useState, useEffect } from "react";
import { Button, Input } from "@nextui-org/react";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";

export const Availability = () => {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [unavailabilities, setUnavailabilities] = useState([]);

  const convertTo12HourFormat = (time24: any) => {
    const [hour, minute] = time24.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12; // Convert 0 to 12 for midnight
    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  useEffect(() => {
    // Fetch all unavailabilities on component mount
    const fetchUnavailabilities = async () => {
      try {
        const response = await axios.get(
          "https://hair-saloon-backend.vercel.app/api/user/get-all-unavailability"
        );
        console.log("Unavailabilities:", response.data.unavailabilitySlots);
        setUnavailabilities(response.data.unavailabilitySlots || []); // Default to an empty array if no data
      } catch (error: any) {
        console.error("Error fetching unavailabilities:", error.message);
        toast.error("Failed to fetch unavailabilities.");
      }
    };
    fetchUnavailabilities();
  }, []);

  const handleStartDateChange = (e: any) => setStartDate(e.target.value);
  const handleStartTimeChange = (e: any) => setStartTime(e.target.value);
  const handleEndDateChange = (e: any) => setEndDate(e.target.value);
  const handleEndTimeChange = (e: any) => setEndTime(e.target.value);

  const handleSubmit = async () => {
    if (startDate && startTime && endDate && endTime) {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${endDate}T${endTime}`);
      if (startDateTime >= endDateTime) {
        toast.error(
          "Please ensure that the start date/time is earlier than the end date/time."
        );
        return;
      }

      const unavailabilityData = {
        startDate,
        startTime,
        endDate,
        endTime,
      };

      try {
        const response = await axios.post(
          "https://hair-saloon-backend.vercel.app/api/user/add-unavailability",
          unavailabilityData
        );

        toast.success("Unavailability saved successfully!");
        console.log("Response after adding unavailability:", response.data);

        // Using the correct field in the response
        const newUnavailability = response.data?.unavailability;
        if (newUnavailability) {
          //@ts-ignore
          setUnavailabilities((prevUnavailabilities) => [
            ...prevUnavailabilities,
            newUnavailability,
          ]);
        } else {
          console.warn("No unavailability data returned from response.");
        }

        // Clear inputs after successful save
        setStartDate("");
        setStartTime("");
        setEndDate("");
        setEndTime("");
      } catch (error: any) {
        console.error("Error saving unavailability:", error.message);
        toast.error("Failed to save unavailability. Please try again.");
      }
    } else {
      toast.error("Please select both start and end dates and times.");
    }
  };

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={"/"}>
            <span>Availability</span>
          </Link>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">Set Unavailability</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          {/* Optionally include additional inputs, icons, or controls here */}
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <div className="flex flex-col gap-4">
          <label htmlFor="start-date-input" className="text-sm font-medium">
            Select Start Date
          </label>
          <Input
            id="start-date-input"
            placeholder="Select Start Date"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            variant="bordered"
          />

          <label htmlFor="start-time-input" className="text-sm font-medium">
            Select Start Time
          </label>
          <Input
            id="start-time-input"
            placeholder="Select Start Time"
            type="time"
            value={startTime}
            onChange={handleStartTimeChange}
            variant="bordered"
          />

          <label htmlFor="end-date-input" className="text-sm font-medium">
            Select End Date
          </label>
          <Input
            id="end-date-input"
            placeholder="Select End Date"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            variant="bordered"
          />

          <label htmlFor="end-time-input" className="text-sm font-medium">
            Select End Time
          </label>
          <Input
            id="end-time-input"
            placeholder="Select End Time"
            type="time"
            value={endTime}
            onChange={handleEndTimeChange}
            variant="bordered"
          />

          {/* Placing the button below the inputs */}
          <Button color="primary" onPress={handleSubmit}>
            Mark as Unavailable
          </Button>
        </div>
      </div>

      {/* Table to display unavailabilities */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold">Unavailability Records</h3>
        <table className="min-w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Start Date</th>
              <th className="border border-gray-300 p-2">Start Time</th>
              <th className="border border-gray-300 p-2">End Date</th>
              <th className="border border-gray-300 p-2">End Time</th>
            </tr>
          </thead>
          <tbody>
            {unavailabilities && unavailabilities.length > 0 ? (
              unavailabilities
                .filter((entry) => entry)
                .map((entry, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">
                      {
                        //@ts-ignore
                        entry?.startDate || "N/A"
                      }
                    </td>
                    <td className="border border-gray-300 p-2">
                      {
                        //@ts-ignore
                        entry?.startTime || "N/A"
                      }
                    </td>
                    <td className="border border-gray-300 p-2">
                      {
                        //@ts-ignore
                        entry?.endDate || "N/A"
                      }
                    </td>
                    <td className="border border-gray-300 p-2">
                      {
                        //@ts-ignore
                        entry?.endTime || "N/A"
                      }
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="border border-gray-300 p-2 text-center"
                >
                  No unavailability records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
