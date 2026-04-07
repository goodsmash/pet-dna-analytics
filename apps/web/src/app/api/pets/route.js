import sql from "@/app/api/utils/sql";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const [pet] = await sql`SELECT * FROM pets WHERE id = ${id}`;
    if (!pet) return Response.json({ error: "Pet not found" }, { status: 404 });
    return Response.json({ pet });
  }

  const pets = await sql`SELECT * FROM pets ORDER BY created_at DESC`;
  return Response.json({ pets });
}

export async function POST(request) {
  try {
    const { name, species, breed_hint } = await request.json();

    if (!name || !species) {
      return Response.json(
        { error: "Missing name or species" },
        { status: 400 },
      );
    }

    const [pet] = await sql`
      INSERT INTO pets (name, species, breed_hint)
      VALUES (${name}, ${species}, ${breed_hint || null})
      RETURNING *
    `;

    return Response.json({ pet });
  } catch (error) {
    console.error("Pet Creation Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, name, species, breed_hint } = await request.json();

    if (!id) {
      return Response.json({ error: "Missing pet id" }, { status: 400 });
    }

    // Update only fields provided
    const [pet] = await sql`
      UPDATE pets 
      SET 
        name = COALESCE(${name}, name),
        species = COALESCE(${species}, species),
        breed_hint = COALESCE(${breed_hint}, breed_hint)
      WHERE id = ${id}
      RETURNING *
    `;

    if (!pet) return Response.json({ error: "Pet not found" }, { status: 404 });
    return Response.json({ pet });
  } catch (error) {
    console.error("Pet Update Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing pet id" }, { status: 400 });
  }

  await sql`DELETE FROM pets WHERE id = ${id}`;
  return Response.json({ success: true });
}
