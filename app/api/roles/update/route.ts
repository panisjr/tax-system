import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type UpdateRolePayload = {
  id: string | number;
  name: string;
  permission_id?: number;
  permission_ids?: number[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<UpdateRolePayload>;

    const id = body.id;
    const name = body.name?.trim() ?? "";
    const permissionIdFromArray =
      Array.isArray(body.permission_ids) && body.permission_ids.length > 0
        ? Number(body.permission_ids[0])
        : null;
    const permissionId = Number(
      permissionIdFromArray ?? body.permission_id ?? NaN,
    );

    if (!id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: "name is required." }, { status: 400 });
    }

    if (!Number.isInteger(permissionId) || permissionId <= 0) {
      return NextResponse.json(
        { error: "permission_id is required." },
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

    // verify permission exists
    const { data: permission, error: permissionError } = await supabaseAdmin
      .from("permissions")
      .select("id")
      .eq("id", permissionId)
      .single();

    if (permissionError || !permission) {
      return NextResponse.json(
        { error: "Selected permission is invalid." },
        { status: 400 },
      );
    }

    // update role
    const { data, error } = await supabaseAdmin
      .from("roles")
      .update({ name, permission_id: permissionId })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
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