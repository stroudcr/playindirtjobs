import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  categories: z.array(z.string()).optional().default([]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, categories } = subscribeSchema.parse(body);

    // Check if already subscribed
    const existing = await db.subscriber.findUnique({
      where: { email },
    });

    if (existing) {
      // Update categories if provided
      if (categories.length > 0) {
        await db.subscriber.update({
          where: { email },
          data: { categories, active: true },
        });
      }

      return NextResponse.json({
        message: "Subscription updated successfully",
        alreadySubscribed: true,
      });
    }

    // Create new subscriber
    await db.subscriber.create({
      data: {
        email,
        categories,
        active: true,
      },
    });

    return NextResponse.json({
      message: "Subscribed successfully! You'll receive job alerts matching your interests.",
    });
  } catch (error) {
    console.error("Subscribe error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

const unsubscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = unsubscribeSchema.parse(body);

    await db.subscriber.update({
      where: { email },
      data: { active: false },
    });

    return NextResponse.json({
      message: "Unsubscribed successfully",
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}
