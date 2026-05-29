// src/config.ts
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm"
const ssm = new SSMClient({ region: "us-east-1" })

async function getParam(name: string) {
  try {
    const res = await ssm.send(new GetParameterCommand({
      Name: name,
      WithDecryption: true
    }))
    return res.Parameter?.Value || ""
  } catch (error) {
    console.error(`Failed to load ${name} from SSM:`, error);
    return "";
  }
}

let isConfigLoaded = false;

export async function loadConfig() {
  if (isConfigLoaded) return;
  if (!process.env.DATABASE_URL)   process.env.DATABASE_URL   = await getParam("/instagram-clone/DATABASE_URL");
  if (!process.env.FRONTEND_URL)   process.env.FRONTEND_URL   = await getParam("/instagram-clone/FRONTEND_URL");
  if (!process.env.JWT_SECRET)     process.env.JWT_SECRET     = await getParam("/instagram-clone/JWT_SECRET");
  if (!process.env.SECRET_KEY)     process.env.SECRET_KEY     = await getParam("/instagram-clone/SECRET_KEY");
  if (!process.env.API_KEY)        process.env.API_KEY        = await getParam("/instagram-clone/API_KEY");
  isConfigLoaded = true;
}