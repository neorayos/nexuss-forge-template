export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    frameworkName:  process.env.FRAMEWORK_NAME         ?? "My Framework",
    clientBefore:   process.env.FRAMEWORK_BEFORE       ?? "",
    clientAfter:    process.env.FRAMEWORK_AFTER        ?? "",
    stages:         JSON.parse(process.env.FRAMEWORK_STAGES      ?? "[]"),
    valueLadder:    JSON.parse(process.env.FRAMEWORK_VALUE_LADDER ?? "[]"),
    tablePrefix:    process.env.FRAMEWORK_TABLE_PREFIX ?? "forge_default",
  });
}
