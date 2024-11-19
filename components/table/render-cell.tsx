import { User } from "@nextui-org/react";
import React from "react";
import { users } from "./data";

interface Props {
  user: (typeof users)[number];
  columnKey: string | React.Key;
}

export const RenderCell = ({ user, columnKey }: Props) => {
  const key = columnKey as keyof typeof user; // Type assertion to narrow down the type
  const cellValue = user[key];

  switch (columnKey) {
    case "name":
      return (
        <User name={cellValue as string}>
          {user.email} {/* Optionally show email under the name */}
        </User>
      );
    case "email":
      return <span>{cellValue}</span>;
    case "contactNo":
      return <span>{cellValue}</span>;
    case "bookingDate":
      return <span>{cellValue}</span>;
    case "bookingTime":
      return <span>{cellValue}</span>;
    case "message":
      return <span>{cellValue}</span>;
    case "actions":
      // Commented out actions (delete, update, view)
      return (
        <div className="flex items-center gap-4">
          <div>
            {/* <Tooltip content="Details">
              <button onClick={() => console.log("View user", user.id)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip> */}
          </div>
          <div>
            {/* <Tooltip content="Edit user" color="secondary">
              <button onClick={() => console.log("Edit user", user.id)}>
                <EditIcon size={20} fill="#979797" />
              </button>
            </Tooltip> */}
          </div>
          <div>
            {/* <Tooltip content="Delete user" color="danger">
              <button onClick={() => console.log("Delete user", user.id)}>
                <DeleteIcon size={20} fill="#FF0080" />
              </button>
            </Tooltip> */}
          </div>
        </div>
      );
    default:
      return <span>{cellValue}</span>;
  }
};
