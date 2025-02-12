import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const path = await generateObject({
    model: openai('gpt-4'),
    system: 'Determine which page the user wants to navigate to from their message.',
    prompt,
    schema: z.object({
      page: z.enum(["/", "/product-detail", "/sell", "mypage"]).describe("The page to navigate to."),
      index: z.number().optional().describe("The index of the product (required for '/product-detail').")
    }).superRefine((data, ctx) => {
      if (data.page === "/product-detail" && data.index === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "index is required for product detail",
          path: ["index"],
        });
      }
      if (data.page !== "/product-detail" && data.index !== undefined) {
        ctx.addIssue({
          code: "custom",
          message: "index is not allowed for home",
          path: ["index"],
        });
      }
    }),
  });

  const result = path.object.page === "/product-detail" ? `${path.object.page}/${path.object.index}` : path.object.page;

  console.log("result: ", result); // John

  return new Response(
    JSON.stringify(result),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}