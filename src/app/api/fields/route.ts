// // src/app/api/fields/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { getSession } from '@/lib/auth';
// import { db } from '@/db';
// import { fields } from '@/db/schema';
// import { eq } from 'drizzle-orm';

// export async function GET() {
//   try {
//     const allFields = await db.query.fields.findMany({
//       with: {
//         categories: {
//           columns: {
//             id: true,
//           },
//         },
//       },
//     });

//     // Transform the data to include category count
//     const fieldsWithCounts = allFields.map(field => ({
//       ...field,
//       categories: field.categories,
//     }));

//     return NextResponse.json(fieldsWithCounts);
//   } catch (error) {
//     console.error('Get fields error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const session = await getSession();

//     // Allow both admin and moderator roles
//     if (!session || (session.role !== 'admin' && session.role !== 'moderator')) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 403 }
//       );
//     }

//     const { name, description } = await request.json();

//     if (!name) {
//       return NextResponse.json(
//         { error: 'Name is required' },
//         { status: 400 }
//       );
//     }

//     const [newField] = await db.insert(fields).values({
//       name,
//       description: description || null,
//     }).returning();

//     return NextResponse.json(newField);
//   } catch (error) {
//     console.error('Create field error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }













// src/app/api/fields/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { fields } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allFields = await db.query.fields.findMany({
      with: {
        categories: true, // ✅ Fetch all category fields including name
      },
    });

    return NextResponse.json(allFields);
  } catch (error) {
    console.error('Get fields error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    // Allow both admin and moderator roles
    if (!session || (session.role !== 'admin' && session.role !== 'moderator')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const [newField] = await db.insert(fields).values({
      name,
      description: description || null,
    }).returning();

    return NextResponse.json(newField);
  } catch (error) {
    console.error('Create field error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}