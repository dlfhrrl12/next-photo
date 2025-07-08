import { getPhotos } from "@/api/photos-api";
import PhotoGrid from "@/components/PhotoGrid";

export default async function Home() {
  const photos = await getPhotos();
  return <PhotoGrid photos={photos} />;
}
