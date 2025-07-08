import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};

export const POST = async (request: NextRequest) => {
  const supabase = await createClient();

  const { caption, imageURL } = await request.json();

  if (!imageURL) {
    return NextResponse.json(
      { error: "Image URL is required" },
      { status: 400 }
    );
  }
  const { data, error } = await supabase
    .from("photos")
    .insert({
      caption: caption,
      image_url: imageURL,
    })
    .select()
    .single();

  if (error) {
    console.error("Error inserting photo:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
};

export const DELETE = async (request: NextRequest) => {
  const supabase = await createClient();
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Photo ID is required" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("photos").delete().eq("id", id);

  if (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Photo deleted successfully" },
    { status: 200 }
  );
};
