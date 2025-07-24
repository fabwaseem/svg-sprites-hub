import { prisma } from "@/lib/db/prisma";
import { getSpriteName } from "@/lib/utils";
import { Icon } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
// @ts-expect-error: svgstore is not typed
import svgstore from "svgstore";

export async function POST(req: NextRequest) {
  const { name, icons, id } = (await req.json()) as {
    name?: string;
    icons?: Icon[];
    id?: string;
  };
  let iconsToUse = icons;
  let nameToUse = name;
  if (id) {
    const sprite = await prisma.sprite.findUnique({
      where: { id },
      include: {
        icons: true,
      },
    });
    if (!sprite) {
      return NextResponse.json({ error: "Sprite not found" }, { status: 404 });
    }

    await prisma.sprite.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });

    iconsToUse = sprite.icons;
    nameToUse = sprite.name;
  }
  // const spriter = new SVGSpriter({
  //   mode: {
  //     symbol: { sprite: getSpriteName(nameToUse) },
  //   },
  //   shape: { id: { generator: (name: string) => name } },
  // });

  // iconsToUse?.forEach((icon) => {
  //   spriter.add(path.resolve(`${getSpriteName(icon.name)}`), null, icon.svg);
  // });

  // const { result } = await spriter.compileAsync();
  // const spriteContent = result.symbol.sprite.contents.toString();

  // Use svgstore to create the sprite
  const sprites = svgstore();
  iconsToUse?.forEach((icon) => {
    sprites.add(icon.name, icon.svg);
  });
  const spriteContent = sprites.toString({ inline: true });

  return new NextResponse(spriteContent, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Content-Disposition": `attachment; filename=${getSpriteName(
        nameToUse
      )}.svg`,
    },
  });
}
