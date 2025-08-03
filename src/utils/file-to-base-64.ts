export async function fileToBase64(
  file: File
): Promise<{ base64: string; extension: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const extension = file.name.split(".").pop() || "jpg";
  return { base64, extension };
}
