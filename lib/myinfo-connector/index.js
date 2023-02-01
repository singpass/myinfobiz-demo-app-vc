import { default as _MyInfoConnector } from "./myinfo-connector";
import { MYINFO_CONNECTOR_CONFIG } from "@/config/myinfo";

export const MyInfoConnector = new _MyInfoConnector(MYINFO_CONNECTOR_CONFIG);
