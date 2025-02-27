"use server";
import * as fs from "fs";
import { FaGitAlt, FaGithub, FaPortrait } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { z } from "zod";

const packageJSONLocation = "./package.json";

function recordsToArr(listName: string) {
  return function (records: Record<string, string>) {
    return Object.entries(records).map(([key, value]) => ({
      fromList: listName,
      name: key,
      version: value,
    }));
  };
}

const parser = z.object({
  name: z.string(),
  version: z.string().optional(),
  // private: z.boolean().optional(),
  // scripts: z.record(z.string()).optional(),
  homepage: z.string().url().optional(),
  // contributors: z.array(z.string()).optional(),
  repository: z
    .any()
    .transform((r) => {
      if (typeof r === "string") {
        return r;
      }
      if (typeof r === "object" && r.url) {
        return r.url;
      }
      return;
    })
    .transform((r) => {
      try {
        z.string().url().parse(r);
        return r;
      } catch (error) {
        return;
      }
    })
    .optional(),
  author: z.string().optional(),
  description: z.string().optional(),
  contributors: z.array(z.any()).optional(),

  dependencies: z
    .record(z.string())
    .transform(recordsToArr("dependencies"))
    .optional(),
  devDependencies: z
    .record(z.string())
    .transform(recordsToArr("devDependencies"))
    .optional(),
  optionalDependencies: z
    .record(z.string())
    .transform(recordsToArr("optionalDependencies"))
    .optional(),
  peerDependencies: z
    .record(z.string())
    .transform(recordsToArr("peerDependencies"))
    .optional(),
  bundledDependencies: z
    .record(z.string())
    .transform(recordsToArr("bundledDependencies"))
    .optional(),
  license: z.string().optional(),
});

const parserWithStrip = parser.transform((data: z.infer<typeof parser>) => {
  delete data.devDependencies;
  delete data.version;
  delete data.dependencies;
  delete data.devDependencies;
  delete data.optionalDependencies;
  delete data.peerDependencies;
  delete data.bundledDependencies;

  delete data.contributors;
  return {
    fromList: undefined as string | undefined,
    ...data,
  };
});

export const revalidate = false;
export async function generateStaticParams() {
  return [];
}

export default async function licences() {
  // get the licences
  const packageJSON = fs.readFileSync(packageJSONLocation, "utf-8");
  const packageJSONUnParsed = JSON.parse(packageJSON);
  const packageJSONParsed = parser.parse(packageJSONUnParsed);

  if (!packageJSONParsed.dependencies) {
    return <div>no dependencies</div>;
  }

  const allPackages = [
    packageJSONParsed.dependencies,
    packageJSONParsed.devDependencies,
    packageJSONParsed.optionalDependencies,
  ]
    .filter((pl) => undefined !== pl)
    .flat()
    .map((dep) => {
      const depName = dep.name;
      const depPackageFileLocation = `./node_modules/${depName}/package.json`;

      const depPackageFile = fs.readFileSync(depPackageFileLocation, "utf-8");
      const depPackageFileUnParsed = JSON.parse(depPackageFile);

      const depPackageFileParsed = parserWithStrip.parse(
        depPackageFileUnParsed
      );
      console.log(depPackageFileParsed.homepage);

      return { ...depPackageFileParsed, fromList: dep.fromList };
    });

  return (
    <main className="flex p-6 flex-col align-center justify-center gap-2 pb-16 w-full">
      <h1 className="text-6xl text-center">Licences used in this project:</h1>
      {allPackages.map((licence) => (
        <article className="md:w-1/2  w-full md:mx-auto" key={licence.name}>
          <div>
            <h2 className="inline-block text-3xl ">{licence.name} © </h2>{" "}
            <p className="inline-block text-3xl ">
              <span>{licence.license}</span>
            </p>
          </div>
          {licence.repository && (
            <div className="block overflow-clip truncate">
              <a
                href={licence.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="text-nowrap text-xl"
              >
                {licence.repository.startsWith("https://github.com") ||
                licence.repository.startsWith("http://github.com") ? (
                  <FaGithub className="inline mr-2" />
                ) : (
                  <FaGitAlt className="inline mr-2" />
                )}
                {licence.repository.startsWith("https://github.com") ||
                licence.repository.startsWith("http://github.com")
                  ? licence.repository.split("github.com/")[1]
                  : licence.repository}
              </a>
            </div>
          )}
          {licence.author && (
            <p className="text-xl block">
              <FaPortrait className="inline mr-2" />
              {licence.author.split(" <")[0]}
            </p>
          )}
          {}
          {licence.homepage && (
            <div className="block overflow-clip truncate">
              <a
                href={licence.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-nowrap text-xl"
              >
                <FaHouse className="inline mr-2" />
                {licence.homepage}
              </a>
            </div>
          )}
        </article>
      ))}
    </main>
  );
}
