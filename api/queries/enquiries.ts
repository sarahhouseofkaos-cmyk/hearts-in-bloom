import { enquiries, type InsertEnquiry } from "@db/schema";
import { getDb } from "./connection";

export async function createEnquiry(data: InsertEnquiry) {
  await getDb().insert(enquiries).values(data);
}
