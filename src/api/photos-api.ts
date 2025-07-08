"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const getPhotos = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error fetching photos: ${error.message}`);
  }

  return data;
};

export const addPhoto = async (newPhoto: {
  imageURL: string;
  caption: string;
}) => {
  const supabase = await createClient();
  const { error } = await supabase.from("photos").insert({
    caption: newPhoto.caption,
    image_url: newPhoto.imageURL,
  });

  if (error) throw new Error(`Error adding photo: ${error.message}`);

  revalidatePath("/");
};

export const deletePhoto = async (id: number) => {
  if (!id) throw new Error("Photo ID is required");

  const supabase = await createClient();
  const { error } = await supabase.from("photos").delete().eq("id", id);

  if (error) throw new Error(`Error deleting photo: ${error.message}`);
  revalidatePath("/");
};
