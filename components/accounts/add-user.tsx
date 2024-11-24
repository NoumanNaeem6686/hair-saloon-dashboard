import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

export const AddUser = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    bookingDate: "",
    bookingTime: "",
    message: "",
  });

  // Handler to update state on input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for when the "Add Customer" button is clicked
  const handleAddCustomer = async () => {
    setIsSubmitting(true);
    try {
      // Ensure form data is not empty
      if (
        !formData.name ||
        !formData.email ||
        !formData.contactNo ||
        !formData.bookingDate ||
        !formData.bookingTime
      ) {
        alert("Please fill out all required fields.");
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}api/user/book-appointment`,
        formData
      );
      console.log("Customer added successfully:", response.data);
      toast.success("Customer added successfully");
      // Optionally clear the form or perform other actions
      setFormData({
        name: "",
        email: "",
        contactNo: "",
        bookingDate: "",
        bookingTime: "",
        message: "",
      });
    } catch (error) {
      console.error(
        "Error adding customer:",
        //@ts-ignore
        error.response ? error.response.data : error.message
      );
      toast.error("Error adding customer");
      alert("Error adding customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Button onPress={onOpen} color="primary">
        Add Customer
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Customer
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Name"
                  variant="bordered"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Email"
                  variant="bordered"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Contact Number"
                  variant="bordered"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Booking Date"
                  type="date"
                  variant="bordered"
                  name="bookingDate"
                  value={formData.bookingDate}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Booking Time"
                  type="time"
                  variant="bordered"
                  name="bookingTime"
                  value={formData.bookingTime}
                  onChange={handleChange}
                  required
                />
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    className="w-full border rounded p-2"
                    rows={4}
                    placeholder="Enter your message here"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onClick={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  isLoading={isSubmitting}
                  onPress={() => {
                    handleAddCustomer();
                    onClose();
                  }}
                >
                  Add Customer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
