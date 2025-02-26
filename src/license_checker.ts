// const checker = require("license-checker");
// import checker from "license-checker";
const checker = require("license-checker");
import { packageSchema } from "@/schema";

const fs = require("fs");
import { z } from "zod";

checker.init(
  {
    start: ".",
    json: true,
  },
  (err: any, packages: any) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    // write to file
    var packagesobj = schema.parse(packages);
    console.log(packagesobj);

    fs.writeFileSync("licenses.json", JSON.stringify(packagesobj, null, 2));
  }
);

export const schema = z
  .record(z.string(), packageSchema)
  .transform((data: Record<string, z.infer<typeof packageSchema>>) =>
    Object.entries(data).map(([key, value]) => ({
      name: key,
      ...value,
    }))
  );

export type Package = z.infer<typeof schema>;
