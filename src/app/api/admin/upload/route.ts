import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/admin/guard";

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  // Redirects to /admin/login when the session is missing or forged.
  const { tenant } = await requireAdmin();

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Pildihoidla pole seadistatud (BLOB_READ_WRITE_TOKEN puudub)." },
      { status: 501 }
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Faili ei leitud." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Lubatud on ainult pildid." }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Pilt on suurem kui 8 MB." }, { status: 413 });
  }

  const blob = await put(`${tenant.slug}/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json({ url: blob.url });
}
