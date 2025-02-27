"use server";
import * as fs from "fs";
import { z } from "zod";

const packageJSONLocation = "./package.json";
const packageJSON = fs.readFileSync(packageJSONLocation, "utf-8");
const packageJSONUnParsed = JSON.parse(packageJSON);

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
const packageJSONParsed = parser.parse(packageJSONUnParsed);

export default async function licences() {
  // get the licences
  if (!packageJSONParsed.dependencies) {
    return <div>no dependencies</div>;
  }

  let allPackages = [parserWithStrip.parse(packageJSONUnParsed)];

  for (const dep of [
    packageJSONParsed.dependencies,
    packageJSONParsed.devDependencies,
    packageJSONParsed.optionalDependencies,
  ]
    .filter((pl) => undefined !== pl)
    .flat()) {
    const depName = dep.name;
    const depPackageFileLocation = `./node_modules/${depName}/package.json`;

    const depPackageFile = fs.readFileSync(depPackageFileLocation, "utf-8");
    const depPackageFileUnParsed = JSON.parse(depPackageFile);

    const depPackageFileParsed = parserWithStrip.parse(depPackageFileUnParsed);
    console.log(depPackageFileParsed.homepage);

    allPackages.push({ ...depPackageFileParsed, fromList: dep.fromList });
  }

  return (
    <div>
      <pre>{JSON.stringify(allPackages, null, 2)}</pre>
    </div>
  );
}
