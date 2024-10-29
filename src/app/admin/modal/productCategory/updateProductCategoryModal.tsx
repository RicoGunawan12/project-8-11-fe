import { toastError, toastSuccess } from "@/app/utilities/toast";
import { getTokenCookie } from "@/app/utilities/token";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React, { useState } from "react";

const UpdateProductCategoryModal = ({
  isOpen,
  onClose,
  reload,
  id
}: {
  isOpen: boolean;
  onClose: () => void;
  reload: () => void;
  id: string
}) => {
  const [newCategory, setNewCategory] = useState<String>();

  const handleChanges = (e: React.FocusEvent<Element>) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;

    setNewCategory(value);
  };

  const handleUpdate = async () => {
    try {
      const token = getTokenCookie();

      if (!token) {
        throw new Error("You are not authorized");
      }

      console.log(newCategory)
      console.log(id)

      const response = await fetch(`${process.env.CATEGORIES}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productCategoryName: newCategory }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      toastSuccess(data.message);
      reload();
    } catch (error: any) {
      toastError(error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-black">
              Update Product Category
            </ModalHeader>
            <ModalBody className="text-black">
              <Input
                type="text"
                label="Product Category"
                size="lg"
                labelPlacement="inside"
                isClearable
                className="mt-6 w-full border-3 rounded-2xl shadow-xl"
                onBlur={handleChanges}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose} onClick={handleUpdate}>
                Update
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UpdateProductCategoryModal;
