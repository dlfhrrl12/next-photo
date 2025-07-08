import { addPhoto, deletePhoto } from "@/api/photos-api";
import { useMutation } from "@tanstack/react-query";

export const useAddPhotoMutation = () => {
  return useMutation({
    mutationFn: addPhoto,
  });
};

export const useDeletePhotoMutation = () => {
  return useMutation({
    mutationFn: deletePhoto,
  });
};
