import { default as _MyInfoConnector } from "./myinfo-connector";
import { MYINFO_CONNECTOR_CONFIG } from "@/config/myinfo";

console.log("MYINFO_CONNECTOR_CONFIG", MYINFO_CONNECTOR_CONFIG);
export const MyInfoConnector = new _MyInfoConnector(MYINFO_CONNECTOR_CONFIG);
