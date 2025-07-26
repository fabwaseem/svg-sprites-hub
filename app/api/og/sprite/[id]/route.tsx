import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch sprite data
    const sprite = await prisma.sprite.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            icons: true,
          },
        },
      },
    });

    if (!sprite) {
      return new Response("Sprite not found", { status: 404 });
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
            padding: 40,
            position: "relative",
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              background:
                "radial-gradient(circle at 20% 80%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #10b981 0%, transparent 50%)",
            }}
          />

          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 30,
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 60,
                height: 60,
                backgroundColor: "#3b82f6",
                borderRadius: 12,
                marginRight: 20,
                boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 28,
                  fontWeight: "700",
                  color: "#3b82f6",
                }}
              >
                SpriteHub
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 16,
                  color: "#9ca3af",
                }}
              >
                Premium SVG Collection
              </div>
            </div>
          </div>

          {/* Category Badge */}
          <div
            style={{
              display: "flex",
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              border: "1px solid #3b82f6",
              borderRadius: 20,
              padding: "8px 16px",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 14,
                color: "#3b82f6",
                fontWeight: "600",
              }}
            >
              {sprite.category.toUpperCase()}
            </div>
          </div>

          {/* Main Title */}
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: "900",
              color: "white",
              marginBottom: 15,
              textAlign: "center",
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
              lineHeight: 1.1,
            }}
          >
            {sprite.name}
          </div>

          {/* Stats Container */}
          <div
            style={{
              display: "flex",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 16,
              padding: 30,
              marginBottom: 30,
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginRight: 80,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 48,
                  fontWeight: "900",
                  color: "#3b82f6",
                  textShadow: "0 2px 10px rgba(59, 130, 246, 0.3)",
                }}
              >
                {sprite._count.icons}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 18,
                  color: "#9ca3af",
                  fontWeight: "600",
                }}
              >
                Icons
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginRight: 80,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 48,
                  fontWeight: "900",
                  color: "#10b981",
                  textShadow: "0 2px 10px rgba(16, 185, 129, 0.3)",
                }}
              >
                {sprite.downloadCount.toLocaleString()}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 18,
                  color: "#9ca3af",
                  fontWeight: "600",
                }}
              >
                Downloads
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      width: 24,
                      height: 24,
                      backgroundColor: "#f59e0b",
                      clipPath:
                        "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                      boxShadow: "0 2px 8px rgba(245, 158, 11, 0.4)",
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 18,
                  color: "#9ca3af",
                  fontWeight: "600",
                  marginTop: 8,
                }}
              >
                Premium
              </div>
            </div>
          </div>

          {/* Icon Placeholders */}
          <div
            style={{
              display: "flex",
              marginBottom: 25,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 70,
                height: 70,
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                borderRadius: 12,
                marginRight: 15,
                border: "2px solid rgba(59, 130, 246, 0.3)",
              }}
            />
            <div
              style={{
                display: "flex",
                width: 70,
                height: 70,
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                borderRadius: 12,
                marginRight: 15,
                border: "2px solid rgba(16, 185, 129, 0.3)",
              }}
            />
            <div
              style={{
                display: "flex",
                width: 70,
                height: 70,
                backgroundColor: "rgba(245, 158, 11, 0.2)",
                borderRadius: 12,
                marginRight: 15,
                border: "2px solid rgba(245, 158, 11, 0.3)",
              }}
            />
            <div
              style={{
                display: "flex",
                width: 70,
                height: 70,
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                borderRadius: 12,
                marginRight: 15,
                border: "2px solid rgba(239, 68, 68, 0.3)",
              }}
            />
            <div
              style={{
                display: "flex",
                width: 70,
                height: 70,
                backgroundColor: "rgba(168, 85, 247, 0.2)",
                borderRadius: 12,
                border: "2px solid rgba(168, 85, 247, 0.3)",
              }}
            />
          </div>

          {/* Author */}
          <div
            style={{
              display: "flex",
              fontSize: 20,
              color: "#9ca3af",
              fontWeight: "500",
            }}
          >
            Created by {sprite.user.name || "Unknown"}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
