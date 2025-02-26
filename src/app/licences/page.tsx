"use server";
// const checker = require("license-checker");
import * as checker from "license-checker";
import { packageSchema } from "@/schema";
import { z } from "zod";
import { revalidateTag, unstable_cache } from "next/cache";
import { FaGitAlt } from "react-icons/fa";

const schema = z
  .record(z.string(), packageSchema)
  .transform((data: Record<string, z.infer<typeof packageSchema>>) =>
    Object.entries(data).map(([key, value]) => ({
      name: key,
      versionlessName:
        key.split("@")[0].length - 1 === 0
          ? key.split("@")[0]
          : key.split("@").slice(0, -1).join("@"),
      ...value,
    }))
  );
async function getLicences() {
  var pgs: z.infer<typeof schema> = [];
  var done = false;

  checker.init(
    {
      start: ".",
      json: true,
      //   direct: true, // this is broken in the current version of license-checker
    },
    (err: any, packages: any) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log("done");

      pgs = schema.parse(packages);
      done = true;
    }
  );
  // wait for the checker to finish
  while (!done) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return pgs;
}

// export async function GET() {
//   const licenses = await unstable_cache(getLicenses, [], { revalidate: false });
//   return NextResponse.json(await licenses());
// }

async function invilidateCache() {
  "use server";
  if (process.env.NODE_ENV !== "development") return;
  revalidateTag("licenses");
  return;
}

const showEmails = false;

export default async function LicencesPage() {
  const l = unstable_cache(getLicences, [], {
    revalidate: false,
    tags: ["licenses"],
  });
  const licences = await l();
  return (
    <main className="p-2 flex flex-col align-center justify-center w-full gap-2 pb-16">
      {process.env.NODE_ENV === "development" && (
        <button
          className="mx-2 p-1 bg-blue-500  rounded self-center"
          onClick={invilidateCache}
        >
          Invalidate Cache
        </button>
      )}
      <hr />
      {licences.map((licence) => (
        <article className="md:w-1/2 w-full mx-2 md:mx-auto" key={licence.name}>
          <div>
            <h2 className="inline-block">{licence.versionlessName}</h2>{" "}
            <p className="inline-block">
              © <span>{licence.licenses}</span>
            </p>
          </div>
          {licence.repository && (
            <a
              href={licence.repository}
              target="_blank"
              rel="noopener noreferrer"
            >
              {licence.repository.startsWith("https://github.com") ? (
                <FaGitAlt className="inline" />
              ) : (
                // if it's not a github link, just show the link
                ""
              )}
              <span>{licence.repository}</span>
            </a>
          )}
          {licence.publisher && (
            <p>
              {licence.publisher}{" "}
              {licence.email && showEmails && (
                <a
                  href={`mailto:${licence.email}`}
                  className="before:content-['<'] after:content-['>']"
                >
                  {licence.email}
                </a>
              )}
            </p>
          )}
          {}
          {licence.url && (
            <a href={licence.url} target="_blank" rel="noopener noreferrer">
              {licence.url}
            </a>
          )}
        </article>
      ))}
    </main>
  );
}
