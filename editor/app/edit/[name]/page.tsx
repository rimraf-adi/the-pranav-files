import { ClientEntry } from "@/components/ClientEntry";

export default async function EditPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  return <ClientEntry name={name} />;
}
