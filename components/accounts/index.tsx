"use client";
import { useEffect, useState } from "react";
import axios from "axios"; // Import axios
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { TableWrapper } from "@/components/table/table";
import { AddUser } from "./add-user";

export const Accounts = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the backend using axios
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/user/appointments"
        );
        console.log("Bookings:", response.data);
        setBookings(response.data.appointments); // Assuming response.data is an array of bookings
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={"/"}>
            <span>Bookings</span>
          </Link>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">All Bookings</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap"></div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <AddUser />
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        {loading ? <p>Loading...</p> : <TableWrapper data={bookings} />}
      </div>
    </div>
  );
};
