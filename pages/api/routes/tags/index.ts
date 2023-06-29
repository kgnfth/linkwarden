import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import getTags from "@/lib/api/controllers/tags/getTags";

export default async function tags(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ response: "You must be logged in." });
  }

  if (req.method === "GET") {
    const tags = await getTags(session.user.id);
    return res.status(tags.status).json({ response: tags.response });
  }
}
