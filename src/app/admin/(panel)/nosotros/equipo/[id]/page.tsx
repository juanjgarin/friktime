import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { members } from "@/db/schema";
import { deleteMember } from "../../../../actions";
import { MemberForm } from "@/components/admin/member-form";
import { DeleteButton } from "@/components/admin/ui";

export default async function EditMember({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "nuevo")
    return (
      <>
        <h1 className="display mb-8 text-3xl sm:text-4xl">Nuevo miembro</h1>
        <MemberForm />
      </>
    );

  const n = Number(id);
  if (!Number.isInteger(n)) notFound();
  const [member] = await getDb().select().from(members).where(eq(members.id, n));
  if (!member) notFound();

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="display text-3xl sm:text-4xl">{member.name}</h1>
        <DeleteButton action={deleteMember.bind(null, member.id)} />
      </div>
      <MemberForm member={member} />
    </>
  );
}
