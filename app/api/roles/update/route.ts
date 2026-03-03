import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type UpdateRolePayload = {
  id: string | number;
  name: string;
  permission_ids?: number[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<UpdateRolePayload>;

    const id = body.id;
    const name = body.name?.trim() ?? "";
    const permissionIds: number[] = Array.isArray(body.permission_ids)
      ? body.permission_ids
          .map((n) => Number(n))
          .filter((n) => Number.isInteger(n) && n > 0)
      : [];

    if (!id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: "name is required." }, { status: 400 });
    }

    if (permissionIds.length === 0) {
      return NextResponse.json(
        { error: "At least one permission is required." },
        { status: 400 },
      );
    }

    // verify role exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("roles")
      .select("id")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Role not found." }, { status: 404 });
    }

    // update role name only
    const { data, error } = await supabaseAdmin
      .from("roles")
      .update({ name })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 🔥 Replace role permissions
    await supabaseAdmin.from("role_permissions").delete().eq("role_id", id);

    const inserts = permissionIds.map((pid) => ({
      role_id: id,
      permission_id: pid,
    }));

    const { error: insertError } = await supabaseAdmin
      .from("role_permissions")
      .insert(inserts);

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 400 },
      );
    }

    return NextResponse.json({
      message: "Role updated successfully.",
      role: data,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process request." },
      { status: 500 },
    );
  }
}